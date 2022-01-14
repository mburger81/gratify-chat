import { Component, Input, OnInit } from '@angular/core';
import { MessageI } from './../../../../app/model/message.interface';
import { UserI } from './../../../../app/model/user.interface';
import { AuthService } from './../../../../app/public/services/auth-service/auth.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent {

  @Input() message: MessageI;
  user: UserI = this.authService.getLoggedInUser();

  constructor(private authService: AuthService) { }

}
