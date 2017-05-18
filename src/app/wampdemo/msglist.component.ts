import { Observable, Subscription, Subject } from 'rxjs/Rx';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

export enum eMsgType {
  Info,
  Message,
  Warning,
  Error
}

export class Message {
  constructor(public msgType: eMsgType, public msg: string) {
  }
}

export class MessageProvider {
  messages = new Subject<Message>();

  provideMsg(msgType: eMsgType, msg: string) {
    this.messages.next(new Message(msgType, msg));
  }
  info(msg: string) { this.provideMsg(eMsgType.Info, msg); }
  message(msg: string) { this.provideMsg(eMsgType.Message, msg); }
  warning(msg: string) { this.provideMsg(eMsgType.Warning, msg); }
  error(msg: string) { this.provideMsg(eMsgType.Error, msg); }
}

@Component({
  selector: 'app-msglist',
  templateUrl: './msglist.component.html',
  styleUrls: ['./msglist.component.css']
})
export class MsglistComponent implements OnInit, OnDestroy {
  @Input()
  messages: MessageProvider;

  msgList: Message[] = [];

  conns = new Subscription;

  msgTypeToString(msgType: eMsgType) {
    return eMsgType[msgType];
  }

  ngOnInit(): void {
    this.conns.add(this.messages.messages.subscribe(msg => {
      this.msgList.push(msg);
    }));
  }
  ngOnDestroy(): void {
    this.conns.unsubscribe();
  }
}
