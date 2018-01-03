#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Queue import Queue
from Queue import Empty
from multiprocessing import cpu_count
import contextlib
import threading

WorkerStop = object()  #


class ThreadPool:

    workers = 0   #  

    threadFactory = threading.Thread
    # 将threading.currentThread
    currentThread = staticmethod(threading.currentThread)


    lock = threading.RLock()

    def __init__(self, maxthreads=cpu_count()*2, name=None):

        self.q = Queue(0)
        self.max = maxthreads
        self.name = name
        self.waiters = [] # 
        self.working = []  # 


    # 
    def start(self):
        needSize = self.q.qsize()
        while self.workers < min(self.max, needSize):
            self.startAWorker()

    # 
    def startAWorker(self):
        self.workers += 1
        name = "PoolThread-%s-%s" % (self.name or id(self), self.workers)
        newThread = self.threadFactory(target=self._worker, name=name)
        newThread.start()

    # 
    def callInThread(self, func, *args, **kw):
        self.callInThreadWithCallback(None, func, *args, **kw)
        self.start()  #  

    def callInThreadWithCallback(self, onResult, func, *args, **kw):
        o = (func, args, kw, onResult)
        self.q.put(o)


    @contextlib.contextmanager
    def _workerState(self, stateList, workerThread):
        stateList.append(workerThread)
        try:
            yield
        finally:
            stateList.remove(workerThread)

    def _worker(self):
        ct = self.currentThread()
        try:
            o = self.q.get(timeout=5)
        except Empty as err:
            o = WorkerStop
     # 
        while o is not WorkerStop:  #  
            with self._workerState(self.working, ct):
             # onResult 默认为None
                function, args, kwargs, onResult = o
                del o
                result = None
                try:
                    result = function(*args, **kwargs)  # 
                    success = True
                except:
                    success = False
                    if onResult is None:
                        pass

                    else:
                        pass

                del function, args, kwargs

                if onResult is not None:
                    try:
                        onResult(success, result)  # 
                    except:
                     #context.call(ctx, log.err)
                        pass

                del onResult, result

            with self._workerState(self.waiters, ct):  #  
                try:
                    o = self.q.get(timeout=5)  # 
                except Empty as err:
                    o = WorkerStop  # 
        else:
            self.lock.acquire()
            self.workers -= 1
            self.lock.release()

    def stop(self):
        while self.workers:
            self.q.put(WorkerStop)
            self.workers -= 1


if __name__ == '__main__':
    import time
    pool = ThreadPool()
    def show(arg):

        # time.sleep(1)
        print '======thread num {}=====\t'.format(pool.workers)
        print arg,'\t\t'


    for i in range(500):
        pool.callInThread(show, i)
    # pool.start()  #
    # time.sleep(4) #
    # chars = list('abcdefghig')
    # for i,v in enumerate(chars):
    #     pool.callInThread(show, v)
    # time.sleep(3)
    # pool.stop()   #
