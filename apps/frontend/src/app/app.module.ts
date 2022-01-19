import { CountryCodeService } from './services/country-code.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { Media } from '@awesome-cordova-plugins/media/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { StreamingMedia } from '@awesome-cordova-plugins/streaming-media/ngx';
import { SuperTabs, SuperTabsModule } from '@ionic-super-tabs/angular';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireAuthModule, } from '@angular/fire/compat/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { IonicHeaderParallaxModule } from 'ionic-header-parallax';

import firebase from 'firebase/compat/app';
import { SettingComponent } from './component/setting/setting.component';
import { ChatmoreComponent } from './component/chatmore/chatmore.component';
import { GroupoptComponent } from './component/groupopt/groupopt.component';
import { BroadcastComponent } from './component/broadcast/broadcast.component';
import { CallPageModule } from './pages/call/call.module';
import { ChatPageModule } from './pages/chat/chat.module';
import { StatusPageModule } from './pages/status/status.module';
import { CameraPageModule } from './pages/camera/camera.module';
import { PhoneService } from './services/phone.service';
import { AlertService } from './services/alert.service';
import { LoginService } from './services/login.service';
import { WebrtcService } from './services/webrtc.service';
import { AudioService } from './services/audio.service';
import { UserService } from './services/user.service';
import { ChatService } from './services/chat.service';
import { EventService } from './services/event.service';
import { StatusService } from './services/status.service';
import { LoadingService } from './services/loading.service';
import { DataService } from './services/data.service';
import { environment } from './../environments/environment.prod';



// for the camera site user to be provider
firebase.initializeApp(environment.firebaseConfig)
@NgModule({
    declarations: [AppComponent, SettingComponent, ChatmoreComponent, GroupoptComponent, BroadcastComponent],
    imports: [BrowserModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        provideFirebaseApp(
            () => initializeApp(environment.firebaseConfig)
        ),
        provideAuth(
            () => getAuth()
        ),
        SuperTabsModule.forRoot(),
        IonicModule.forRoot(),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        IonicHeaderParallaxModule,
        AngularFireStorageModule,
        AppRoutingModule,
        CallPageModule,
        ChatPageModule,
        StatusPageModule,
        CameraPageModule,
    ],
    providers: [
        AngularFireAuthModule,
        AngularFireModule,
        Camera,
        Media,
        NativeAudio,
        StreamingMedia,
        CallNumber,
        File,
        SuperTabs,
        PhoneService,
        AlertService,
        LoginService,
        WebrtcService,
        UserService,
        CountryCodeService,
        ChatService,
        AudioService,
        EventService,
        StatusService,
        LoadingService,
        DataService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
