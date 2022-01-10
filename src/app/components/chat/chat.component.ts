import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';


// custom imports
import { ChatService } from '../../shared/services/chat/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements AfterViewInit, OnInit {
  @ViewChild(IonContent) private content: IonContent;

  messages: Observable<any[]>;
  newMsg = '';

  constructor(private chatService: ChatService) {
  }
  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
  }
  ngAfterViewInit() {
    // this.content.scrollToBottom(300).then(() => {});
  }


  sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom(300).then(() => {});
    });
  }
}
