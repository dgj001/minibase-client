import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Semaphore {
  lockIdChanged = new BehaviorSubject<string>(undefined);
  private lockId: string;

  requestLock(id: string): boolean {
    if (!this.lockId) {
      // console.log('locking: ' + id);
      this.lockId = id;
      this.lockIdChanged.next(this.lockId);
      return true;
    }
    return false;
  }

  releaseLock(id: string) {
    if (this.lockId === id) {
      // console.log('releasing: ' + id);
      this.lockId = undefined;
      this.lockIdChanged.next(this.lockId);
    }
  }
}
