import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import {Globals} from '../../app/datos/global';
import { Media, MediaObject } from '@ionic-native/media';
import { ToastController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  global: any;
  file: MediaObject;
  constructor( public platform: Platform, public navCtrl: NavController, public gl : Globals, private media: Media, 
    public toastCtrl: ToastController, private filef: File, 
    private transfer: FileTransfer) {
    this.global= gl.categories_dt;
    
   /* this.filef.checkDir(this.filef.dataDirectory, 'www').then(_ => this.presentToast('Directory exists')
    ).catch(err => this.presentToast('Directory doesn\'t exist'));*/

  }

  preparatesound(fileName){
    this.filef.resolveDirectoryUrl(this.filef.applicationDirectory).then((rd)=>{
   /*   this.filef.listDir(rd.nativeURL, 'www/assets/sounds')
      .then(items =>{
        for(let i in items){
          this.presentToast(items[i].fullPath); // I see “database.db” here
        }
        })
        .catch(err => {
          this.presentToast(JSON.stringify(err) );
        });*/
        this.presentToast(rd.nativeURL+'/www/assets/sounds/'+fileName);
    this.filef.copyFile(rd.nativeURL+ 'www/assets/sounds', fileName, this.filef.externalDataDirectory+'sounds', fileName)
      .then(data=>{
        this.presentToast(" file copied ")
      })
      .catch(err=>{
        this.presentToast(" file err "+JSON.stringify(err));
      })
    })
    

  }
  //esta funcion permite reproducir todos los sonidos pero descargandose de un servidor
  play(ruta:string){
    // ya puedo acceder a los archivos de sonidos en la apk. pero se deben pasar a guardar en el dispositivo par que no genere error con
    // por los audios

    let filemane= ruta.split("/")[2];
    console.log(filemane);
    let url =  'http://dangeloaltamoda.com/Wawakunapak/sounds/'+filemane;
    this.platform.ready().then(() => {
        this.filef.resolveDirectoryUrl(this.filef.externalDataDirectory).then((rd)=>{

          this.filef.checkFile(rd.nativeURL,filemane).then((data)=>{
            this.presentToast('ya existe archivo');
            this.playcreate(rd.nativeURL,filemane);
          }).catch(err=>{
            if(err.code==1){
            // this.preparatesound(filemane);
            this.presentToast(url);
              const fileTransfer: FileTransferObject = this.transfer.create();
                fileTransfer.download(url,this.filef.externalDataDirectory+filemane).then((entry) => {
                  this.presentToast('download complete' + entry.toURL());     
                  this.playcreate(this.filef.externalDataDirectory,filemane);         
                }).catch(err_2 => {
                  this.presentToast("Download error!"+ JSON.stringify(err_2));             
                });
            }
          });
        });
      //this.presentToast(rd.nativeURL+'www/'+ruta);
     /*this.filef.checkDir(rd.nativeURL, 'www/assets/sounds/').then(_ => 
      {
        this.presentToast('Directory exists')
        this.file= this.media.create(rd.nativeURL+'www/'+ruta);
        this.file.onSuccess.subscribe(() => {
          this.presentToast	('archivo correcto')
          this.file.play()
        });
   
        this.file.onError.subscribe(error =>{         
          this.presentToast(JSON.stringify(error)); 
          console.log(error)} );

      }
      ).catch(err => this.presentToast('Directory doesn\'t exist'+JSON.stringify(err)));
     */
     })
     

  }

  playcreate(url,filename){    
    if(this.file != null){
      this.file.release();
    }

    this.file= this.media.create(url+filename);

            // to listen to plugin events:

          //  file.onStatusUpdate.subscribe(status => this.presentToast(JSON.stringify( status))); // fires when file status changes

          this.file.onSuccess.subscribe(() => this.presentToast('Action is successful'));

          this.file.onError.subscribe(error => this.presentToast('Error!'+ JSON.stringify( error)));

            // play the file
          
          this.file.play();
        //  window.setTimeout(() => {this.file.stop();}, 60000);


  }
  //reproducir los sonidos que estan en los assets/sound usando solo el plugin media y file. se debe declarar una sola ves y debe aplicar la funcion releas
  play2(ruta:string){
    // ya puedo acceder a los archivos de sonidos en la apk. pero se deben pasar a guardar en el dispositivo par que no genere error con
    // por los audios
     this.filef.resolveDirectoryUrl(this.filef.applicationDirectory).then((rd)=>{
      //this.presentToast(rd.nativeURL+'www/'+ruta);
     this.filef.checkDir(rd.nativeURL, 'www/assets/sounds/').then(_ => this.presentToast('Directory exists')
      ).catch(err => this.presentToast('Directory doesn\'t exist'+JSON.stringify(err)));
      if(this.file != null){
        this.file.release();
      }
      this.file= this.media.create(rd.nativeURL+'www/'+ruta);
      this.file.onSuccess.subscribe((onSuccess) => this.presentToast	('archivo correcto'+onSuccess));
   
       this.file.onError.subscribe(error =>{
         
         this.presentToast(JSON.stringify(error)); console.log(error)} );
       this.file.play()
       });
    }

  borrrarudios(){    
    this.presentToast('borrar');
    this.file.release();
    this.file.onSuccess.subscribe(() => this.presentToast('Action is successful borrar'));
    this.file.onError.subscribe(error => this.presentToast('Error! borrar'+ JSON.stringify( error)));
  }
  presentToast(msg:string) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 10000
    });
    toast.present();
  }
}
