import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Media } from '@awesome-cordova-plugins/media/ngx';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { StreamingMedia } from '@awesome-cordova-plugins/streaming-media/ngx';
import { IonicModule } from '@ionic/angular';


// custom imports
import { ConversationComponent } from './conversation.component';
import { ConversationRoutingModule } from './conversation-routing.module';
import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
  declarations: [
    ConversationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ConversationRoutingModule
  ],
  providers: [
    Camera,
    File,
    Media,
    NativeAudio,
    StreamingMedia
  ]
})
export class ConversationModule { }
