import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPage } from './chat.page';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
    ],
    declarations: [ChatPage]
})
export class ChatPageModule {}
