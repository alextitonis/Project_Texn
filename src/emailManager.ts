import * as nodemailer from 'nodemailer'; 

export class emailManager {
    static getInstance: emailManager
    transporter

    constructor() {
        emailManager.getInstance = this
        this.transporter = nodemailer.createTransport( 
            'smtps://' + process.env.EMAIL + ':' + process.env.PASSWORD + '@smtp.gmail.com'
          ); 
    }

    sendEmail(email: string, subject: string, text: string) {
        var mailOptions = { 
            from : process.env.EMAIL,
            to : email, 
            subject : subject, 
            text: text 
        }; 
       
        this.transporter.sendMail( mailOptions, (error, info) => { 
            if (error) { 
              return console.log(`error: ${error}`); 
            } 
            console.log(`Message Sent ${info.response}`); 
        }); 
    }
}