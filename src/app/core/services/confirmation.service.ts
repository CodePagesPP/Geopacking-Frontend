import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';


export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

 
  private state = new Subject<ConfirmationOptions & { isOpen: boolean }>();
  
 
  private result = new Subject<boolean>();

 
  public modalState$ = this.state.asObservable();

  constructor() { }

  public confirm(options: ConfirmationOptions): Observable<boolean> {
   
    this.state.next({ ...options, isOpen: true });
    

    return this.result.asObservable().pipe(take(1));
  }


  public onConfirm(): void {
    this.state.next({ isOpen: false, title: '', message: '' }); 
    this.result.next(true); 
  }


  public onCancel(): void {
    this.state.next({ isOpen: false, title: '', message: '' }); 
    this.result.next(false); 
  }
}