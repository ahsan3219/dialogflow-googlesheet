// import { Configuration, OpenAIApi } from "openai";
// import module from 'module'

// require('dotenv').config();



// const mongoose =require( 'mongoose');
// const {express,  response }=  require('express');
// const morgan = require('morgan');
// const moment = require('moment')
// const momentTZ =require('moment-timezone');
// const bodyParser = require('body-parser');
// import pkg from 'dialogflow-fulfillment';
// const { WebhookClient } = pkg;

// const rp  =require('request-promise-native');
// const dfff =require('dialogflow-fulfillment');


//ajasjaskjdlksaskjdak21212


import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express, { response } from 'express';
import morgan from 'morgan';
import moment from 'moment';
import momentTZ from 'moment-timezone';
import bodyParser from 'body-parser';
import { WebhookClient } from 'dialogflow-fulfillment';

dotenv.config();
// const app = express()
// app.use(express.json())
// app.use(morgan('dev'))

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const textGeneration = async (prompt) => {

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `${prompt}: `,
            temperature: 0.9,
            max_tokens: 200,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            // stop: ['Human:', 'AI:']
        });
    
        return {
            status: 1,
            response: `${response.data.choices[0].text}`
        };
    } catch (error) {
        return {
            status: 0,
            response: ''
        };
    }
};


const webApp = express();

const PORT = process.env.PORT;

webApp.use(express.urlencoded({ extended: true }));
webApp.use(express.json());
webApp.use((req, res, next) => {
    console.log(`Path ${req.path} with Method ${req.method}`);
    next();
});


webApp.get('/', (req, res) => {
    res.sendStatus(200);
});

const webhookRequest = {
    "responseId": "response-id",
    "session": "projects/project-id/agent/sessions/session-id",
    "queryResult": {
        "queryText": "End-user expression",
        "parameters": {
            "param-name0": "param-value",
            "param-name1": "param-value",
            "param-name2": "param-value"
        },
        "allRequiredParamsPresent": true,
        "fulfillmentText": "Response configured for matched intent",
        "fulfillmentMessages": [
            {
                "text": {
                    "text": [
                        "Response configured for matched intent"
                    ]
                }
            }
        ],
        "outputContexts": [
            {
                "name": "projects/project-id/agent/sessions/session-id/contexts/context-name",
                "lifespanCount": 5,
                "parameters": {
                    "param-name": "param-value"
                }
            }
        ],
        "intent": {
            "name": "projects/project-id/agent/intents/intent-id",
            "displayName": "matched-intent-name"
        },
        "intentDetectionConfidence": 1,
        "diagnosticInfo": {},
        "languageCode": "en"
    },
    "originalDetectIntentRequest": {}
}

const pluck = (arr) => {
    const min = 0;
    const max = arr.length - 1;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return arr[randomNumber]
}

webApp.post("/webhook", async (req, res) => {
    try {
      const body = req.body;
      const intentName = body.queryResult.intent.displayName;
      const params = body.queryResult.parameters;
  
      switch (intentName) {
        case "Default Welcome Intent": {
          const currentTime = momentTZ.tz(moment(), "Europe/Brussels");
          const currentHour = +moment(currentTime).format("HH");
          console.log("currentHour: ", currentHour);
  
          let greeting = "";
  
          if (currentHour < 6) {
            greeting = "good night";
          } else if (currentHour < 12) {
            greeting = "good morning";
          } else if (currentHour < 15) {
            greeting = "good afternoon";
          } else if (currentHour < 17) {
            greeting = "good evening";
          } else {
            greeting = "good night";
          }
  
          let responseText = pluck([
            `${greeting}! Welcome, I am your details assistant. How can I help you?`
          ]);
          console.log(responseText);
  
          res.send({
            fulfillmentMessages: [
              {
                text: {
                  text: [responseText]
                }
              }
            ]
          });
  
          break;
        }
        case "Default Fallback Intent": {
         
         
            const api_url = 
                        `https://sheetdb.io/api/v1/keqbu2v4inoqz/ `;
                    
                  // Defining async function
                  async function getapi(url) {
                      
                      // Storing response
                     let response = await fetch(url);
                      
                      // Storing data in form of JSON
                      var data = await response.json();
                      // console.log("data: ", data);
         text(data)         
         
                    }
          
          async function text(data){

            let action = req.body.queryResult.action;
            let queryText = req.body.queryResult.queryText;
            console.log("action: ", action);
// console.log("data: ", data);
let datas=JSON.stringify(data);
let anc=`The is the list of all members in json form ${datas} Kindly read it carefully and  answer the question accordingly answer should be in text form should not contain json format.Remember last question and if need answer next question accordingly.My first question is ${queryText}`
            let result = await textGeneration(anc);
            if (data) 
            { 
       
          if (result.status == 1) {
         console.log("responseText: ", result.response);
        //  console.log("data: ", data);
  //  res.send({
  //             fulfillmentText: result.response
  //           });
         
 res.send({
                            "fulfillmentMessages": [
                                {
                                    "text": {
                                        "text": [
                                            result.response
            
                                        ]
                                    }
                                }
                            ]
                           
                        })

}
       
       
        }
            
            
        // res.send({
        //       fulfillmentText: result.response
        //   });
            
            
            
            
        
        // {
          //   console.log("responseText: ", result.response);
            // }         
            // console.log("responseText: ", data);
          }

         getapi(api_url);   
        //   else if (!intentName) {
        //     console.log("intentName: ", intentName);
        //     res.send({
        //       fulfillmentText: `Sorry, I'm not able to help with that.`
        //     });
        //   }
          break;
        }



//         case 'details': {
//                         console.log("collected params: ", params);
//                         console.log("Name ", params.person.name);
            
            
//             if (params.person.name)
//             {            const api_url = 
//                         `https://sheetdb.io/api/v1/keqbu2v4inoqz/search_or?Name=${params.person.name}`;
                    
//                   // Defining async function
//                   async function getapi(url) {
                      
//                       // Storing response
//                      let response = await fetch(url);
                      
//                       // Storing data in form of JSON
//                       var data = await response.json();
//                       console.log("data: ", data);
//                       call(data);
//                     }
            
//                     function call(data){
//             let a=Math.random();
//             a=parseInt(a*100);
//             console.log("a: ", a);
//             if(a<20){

                
//                 let responseText = `Ok. ${params.person.name} Your email is ${data[0].Email} and your phone number is ${data[0].Phone}. Do you want to know anything else?`;
//                 text(responseText)    
//             }   else if(a<40){

//                 let responseText=`${params.person.name}, I've got your details here. Your email is ${data[0].Email}, your phone number is ${data[0].Phone} , and your surname is ${data[0].Surname}.                        ` 
//                 text(responseText)    

//             }        
// else if(a<60){

//     let responseText=`${params.person.name}, I have your information on file. It looks like your email is ${data[0].Email}, your phone number is ${data[0].Phone}, and your surname is ${data[0].Surname}.
//        `
//        text(responseText)    

//     }   
// else if(a<80){


//     let responseText=`${params.person.name}, your email is ${data[0].Email}, your phone number is ${data[0].Phone}, and your surname is ${data[0].Surname}.`
//     text(responseText)    

// }   
// else if(a<90){let responseText=`${params.person.name}, I have your contact information here. Your email is ${data[0].Email}, your phone number is ${data[0].Phone}, and your surname is ${data[0].Surname}.`
// text(responseText)    

// }          
// else{

//     let responseText=`${params.person.name} , I have  details on record.  Email is ${data[0].Email},  Phone number is ${data[0].Phone}, and  Surname is ${data[0].Surname}`
//     text(responseText)    

// }  
//                     }
//                     function text(data){

//                         if (data) {
//                             res.send({
//                                 fulfillmentText: data
//                             });
//                         }         
//                         console.log("responseText: ", data);
//                     }
               
//                      getapi(api_url);      
//             }
            
//             console.log("collected params: ", params);

            
//             if (params.email)
//             {            const api_url = 
//                         `https://sheetdb.io/api/v1/keqbu2v4inoqz/search_or?Email=${params.person.email}`;
                    
//                   // Defining async function
//                   async function getapi(url) {
                      
//                       // Storing response
//                      let response = await fetch(url);
                      
//                       // Storing data in form of JSON
//                       var data = await response.json();
//                       console.log("data: ", data);
//                       call(data);
//                     }
            
//                     function call(data){
//             let a=Math.random();
//             a=parseInt(a*100);
//             console.log("a: ", a);
//             if(a<20){

                
//                 let responseText = `Ok. ${data[0].Name} Your email is ${params.person.email} and your phone number is ${data[0].Phone}. Do you want to know anything else?`;
//                 text(responseText)    
//             }   else if(a<40){

//                 let responseText=`${data[0].Name}, I've got your details here. Your email is ${params.person.email}, your phone number is ${data[0].Phone} , and your surname is ${data[0].Surname}.                        ` 
//                 text(responseText)    

//             }        
// else if(a<60){

//     let responseText=`${data[0].Name}, I have your information on file. It looks like your email is ${params.person.email}, your phone number is ${data[0].Phone}, and your surname is ${data[0].Surname}.
//        `
//        text(responseText)    

//     }   
// else if(a<80){


//     let responseText=`${data[0].Name}, your email is ${params.person.email}, your phone number is ${data[0].Phone}, and your surname is ${data[0].Surname}.`
//     text(responseText)    

// }   
// else if(a<90){let responseText=`${data[0].Name}, I have your contact information here. Your email is ${params.person.email}, your phone number is ${data[0].Phone}, and your surname is ${data[0].Surname}.`
// text(responseText)    

// }          
// else{

//     let responseText=`${data[0].Name} , I have  details on record.  Email is ${params.person.email},  Phone number is ${data[0].Phone}, and  Surname is ${data[0].Surname}`
//     text(responseText)    

// }  

//                     }
                  
//                     function text(data){

//                         if (data) {
//                             res.send({
//                                 fulfillmentText: data
//                             });
//                         }         
//                         console.log("responseText: ", data);
//                     }
               
//                      getapi(api_url);      
//             }
            
// else{console.log("ERROR");}            
            
//                      // console.log("abc: ", abc);
            
//             // res.send({
//             //                 "fulfillmentMessages": [
//             //                     {
//             //                         "text": {
//             //                             "text": [
//             //                                function text(res){
//             //                                 return res;
//             //                                }
            
//             //                             ]
//             //                         }
//             //                     }
//             //                 ]
                           
//             //             })
            
//                         break;
                    
//                       }  
                      





                      case 'wholelist': {
            
            
                        // https://sheetdb.io/api/v1/58f61be4dda40?cast_numbers=name,email,phone,surname
                        const api_url = 
                        `https://sheetdb.io/api/v1/keqbu2v4inoqz`;
                    
                  // Defining async function
                  async function getapi(url) {
                      
                      // Storing response
                     let response = await fetch(url);
                      
                      // Storing data in form of JSON
                      var data = await response.json();
                      // console.log("data: ", data);
text(data)
                    }
            
                    function text(data){

                        if (data) 
                        
                        {
                          
                          
                          
                          // data.map((item)=>{
                          //   let responseText = `Name: ${item.Name}, Email: ${item.Email}, Phone: ${item.Phone}, Surname: ${item.Surname}`;
                          //   console.log("responseText: ", responseText);
                          //   res.send({
                          //       fulfillmentText: responseText
                          //   });


                          //  })
                          
                          // data.forEach((item) => {
                          //   let responseText = `Name: ${item.Name}, Email: ${item.Email}, Phone: ${item.Phone}, Surname: ${item.Surname}`;
                          //   console.log("responseText: ", responseText);
                          //   res.send({
                          //     fulfillmentText: responseText
                          //   });
                          // });
                        
                          let responseTexts = [];

                          data.forEach((item) => {
                            // let responseText = `Name: ${item.Name} \n,  Email: ${item.Email} \n, Phone: ${item.Phone} \n, Surname: ${item.Surname} \n ,\n`;
                            let responseText = `Name: \n${item.Name} \nEmail: ${item.Email} \nSurname: ${item.Surname} \nPhone: ${item.Phone}\n\n`;

                            console.log("responseText: ", responseText);
                            responseTexts.push(responseText);
                          });
                          
                          res.send({
                            fulfillmentText: responseTexts.join('\n')
                          });
                          
                        
                        
                        
                          //   {
                        //     res.send({
                        //         fulfillmentText: data
                        //     });
                        // }
                      
                      
                      
                      }         
                        // console.log("responseText: ", data);
                    }
               
                    let abc=  getapi(api_url);      
            
            console.log("abc: ", abc);
            
            // res.send({
            //                 "fulfillmentMessages": [
            //                     {
            //                         "text": {
            //                             "text": [
            //                                function text(res){
            //                                 return res;
            //                                }
            
            //                             ]
            //                         }
            //                     }
            //                 ]
                           
            //             })
            
                        break;
                    
                      }  



                      case 'columname': {
            
            
            // /            https://sheetdb.io/api/v1/58f61be4dda40?cast_numbers=name,email,phone,surname
                        const api_url = 
                        `https://sheetdb.io/api/v1/keqbu2v4inoqz/keys`;
                    
                  // Defining async function
                  async function getapi(url) {
                      
                      // Storing response
                     let response = await fetch(url);
                      
                      // Storing data in form of JSON
                      var data = await response.json();
                      console.log("data: ", data);
text(data)
                    }
function text(data){
  
  if(data){
  
      res.send({
        fulfillmentText: `The column are
         ${data[0]} and ${data[1]} and ${data[2]} and ${data[3]}`
    })
  }
}


                    let abc=  getapi(api_url);      
            
            console.log("abc: ", abc);
            
                        break;
                    
                      } 


                      case 'row': {
            
            
                        // /            https://sheetdb.io/api/v1/58f61be4dda40?cast_numbers=name,email,phone,surname
                                    const api_url = 
                                    `https://sheetdb.io/api/v1/keqbu2v4inoqz/count`;
                                
                              // Defining async function
                              async function getapi(url) {
                                  
                                  // Storing response
                                 let response = await fetch(url);
                               console.log("response: ", response);   
                                  // Storing data in form of JSON
                                  var data = await response.json();
                                  console.log("data: ", data);
            text(data)
                                }
            function text(data){
              console.log(data.rows);
              if(data){
                  res.send({
                    fulfillmentText: `The number of rows are ${data.rows}`
                })
              }
            }                        let abc=  getapi(api_url);      
                    
                        console.log("abc: ", abc);
                        
                                    break;
                                
                                  } 
            



        default: {
          res.send({
            fulfillmentText: `No handler for the action ${action}.`
          });
        }
      }
    } catch (error) {
      console.log("error: ", error);
      res.send({
        fulfillmentText: `Sorry, I'm not able to help with that.`
      });
    }
  });
  webApp.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}`)
})














// app.post("/webhook", async (req, res) => {
//     try {
//         const body = req.body;

//         const intentName = body.queryResult.intent.displayName
//         const params = body.queryResult.parameters


//         switch (intentName) {
//             case 'Default Welcome Intent': {

//                 const currentTime = momentTZ.tz(moment(), "Europe/Brussels");
//                 const currentHour = +moment(currentTime).format('HH');
//                 console.log("currentHour: ", currentHour);

//                 let greeting = '';

//                 if (currentHour < 6) {
//                     greeting = "good night"
//                 } else if (currentHour < 12) {
//                     greeting = "good morning"
//                 } else if (currentHour < 15) {
//                     greeting = "good afternoon"
//                 } else if (currentHour < 17) {
//                     greeting = "good evening"
//                 } else {
//                     greeting = "good night"
//                 }

//                 let responseText = pluck([
//                                         `${greeting}! welcome ,I am your details assistant. How can I help you?`
//                     //                     // "this is alternate response from webhook server",
                                    
//                                       ])
//                 console.log(responseText);

//                 res.send({
//                     "fulfillmentMessages": [
//                         {
//                             "text": {
//                                 "text": [
//                                     responseText
//                                 ]
//                             }
//                         }
//                     ]
//                 })


//                 break;
//             }
                   
           
          
           
//             case 'Default Fallback Intent': {
//                 console.log("collected params: ", params);


//                 let result = await textGeneration(queryText);
//                 if (result.status == 1) {
//                     res.send(
//                         {
//                             fulfillmentText: result.response
//                         }
//                     );
//                 } else {
//                     res.send(
//                         {
//                             fulfillmentText: `Sorry, I'm not able to help with that.`
//                         }
//                     );
//                 } 
//                 else {
//                     res.send(
//                         {
//                             fulfillmentText: `No handler for the action ${action}.`
//                         }
//                     );
//                 }
//                 }
// }      


// //                 async function callOpenAI(text) {
// //   const openaiApiKey = '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'; // replace with your OpenAI API key
// //   const url = 'https://api.openai.com/v1/completions';

// //   const headers = {
// //     'Content-Type': 'application/json',
// //     'Authorization': `Bearer ${openaiApiKey}`
// //   };

// //   const data = {
// //     prompt: text,
// //     temperature: 0.5,
// //     max_tokens: 50,
// //     top_p: 1,
// //     frequency_penalty: 0,
// //     presence_penalty: 0
// //   };

// //   const response = await axios.post(url, data, { headers });
// //   console.log("response.data.choices[0].text",response.data.choices[0].text);
// //   return response.data.choices[0].text;
// // }

// // module.exports.dialogflowFirebaseFulfillment = async (agent) => {
// //   const fallbackSentence = agent.query;
// //   console.log(`Fallback sentence: ${fallbackSentence}`);

// //   const response = await callOpenAI(fallbackSentence);
// //   console.log(`OpenAI response: ${response}`);

// //   agent.add(response);
// // };




//                 // const configuration = new Configuration({
//                 //     apiKey: process.env.OPENAI_API_KEY,
//                 //   });
//                 //   const openai = new OpenAIApi(configuration);
                  
//                 //   const query = params;
//                 //     console.log("query",query);
//                 //     if (query.any.length === 0
//                 //     ) {
//                 //       res.status(400).json({
//                 //         error: {
//                 //           message: "Please enter a valid query",
//                 //         }
//                 //       });
//                 //       return;
//                 //     }
                  
//                 //     try {
//                 //     //   const completion = await openai.createCompletion({
//                 //     //     model: "text-davinci-002",
//                 //     //     prompt: generatePrompt(query,profession),
//                 //     //     temperature: 0.3,
//                 //     //     max_tokens: 300,
//                 //     //     // top_p: 1,
//                 //     //     // frequency_penalty: 0,
//                 //     //     // presence_penalty: 0.6,
//                 //     //     // // stop: ['Human:', 'AI:']

//                 //     //   });
                  
                  
//                 //       const completion = await openai.createCompletion({
//                 //         model: "text-davinci-002",
//                 //         prompt: query.any,
//                 //         temperature: 0.3,
//                 //         max_tokens: 200,
//                 //       });
                  
//                 //       res.status(200).json({ result: completion.data.choices[0].text });
//                 //       console.log("result",completion.data);
//                 //     } catch(error) {
//                 //       // Consider adjusting the error handling logic for your use case
//                 //       if (error.response) {
//                 //         console.error(error.response.status, error.response.data);
//                 //         res.status(error.response.status).json(error.response.data);
//                 //       } else {
//                 //         console.error(`Error with OpenAI API request: ${error.message}`);
//                 //         res.status(500).json({
//                 //           error: {
//                 //             message: 'An error occurred during your request.',
//                 //           }
//                 //         });
//                 //       }
                   
            
            
            
            
            
                















//             let responseText = `Ok. ${params.any} Your email is  and your phone number is . How can i help you?`
    
    
          
    
//     // console.log("abc: ", abc);
//                 res.send({
//                     "fulfillmentMessages": [
//                         {
//                             "text": {
//                                 "text": [
//                                     responseText
    
//                                 ]
//                             }
//                         }
//                     ]
                   
                
                                                      
//                 })
          
                         
//           case 'details': {
//             console.log("collected params: ", params);
//             console.log("Name ", params.person.name);



//             const api_url = 
//             `https://sheetdb.io/api/v1/keqbu2v4inoqz/search_or?Name=${params.person.name}`;
        
//       // Defining async function
//       async function getapi(url) {
          
//           // Storing response
//          let response = await fetch(url);
          
//           // Storing data in form of JSON
//           var data = await response.json();
//           console.log("data: ", data);
//           call(data);
//         }

//         function call(data){

//             let responseText = `Ok. ${params.person.name} Your email is ${data[0].Email} and your phone number is ${data[0].Phone}. How can i help you?`
//         console.log("responseText: ", responseText);
//         }
//    let abc=  getapi(api_url);      

// console.log("abc: ", abc);
//             res.send({
//                 "fulfillmentMessages": [
//                     {
//                         "text": {
//                             "text": [
//                                 responseText

//                             ]
//                         }
//                     }
//                 ]
               
//             })

//             break;
        
//           }  
          
          
//           default:
//                 res.send({
//                     "fulfillmentMessages": [
//                         {
//                             "text": {
//                                 "text": [
//                                     "sorry webhook dont know answer for this intent"
//                                 ]
//                             }
//                         }
//                     ]
//                 })
//                 break;
//         }


//     } catch (e) {
//         console.error("Error adding order:", e);

//         res.send({
//             "fulfillmentMessages": [
//                 {
//                     "text": {
//                         "text": [
//                             "something is wrong in server, please try again"
//                         ]
//                     }
//                 }
//             ]
//         })
//     }
// })

  

// app.post("/a",express.json, function (request, response) {
//     dialogflow(request, response);
// });
// const dialogflow = (request, response) => {
    //     const agent = new dfff.WebhookClient({ request, response });
    //     async function demo(agent) {
//         const name = req.body.queryResult.parameters.name;
// const url = `https://sheetdb.io/api/v1/keqbu2v4inoqz/search_or?Name=${name}`;
// console.log("url: ", url);
//         const data = await rp.get(url);
//         console.log("data: ", data);
//         const body = JSON.parse(data);
//         const email = body[0].Email;
//         const phone = body[0].Phone;
//         const surname = body[0].Surname;
//         agent.add(`Ok. ${name} ${surname} Your email is ${email} and your phone number is ${phone}. How can i help you?`);
//     }
//     let intentMap = new Map();
//     intentMap.set('details', demo);
//     agent.handleRequest(intentMap);
// };

// app.post("/a", (request, response) => {
//     const _agent=new WebhookClient({request,response});
//     function details(agent,Name,Email,Phone) {

// //         const api_url = 
// //         `https://sheetdb.io/api/v1/keqbu2v4inoqz/search_or?Name=adam`;
    
// //   // Defining async function
// //   async function getapi(url) {
      
// //       // Storing response
// //      let response = await fetch(url);
      
// //       // Storing data in form of JSON
// //       var data = await response.json();
// //       console.log("data: ", data);
      
// //     }

// //  jQuery.ajax({
// //     type: "POST",
// //     url: `https://sheetdb.io/api/v1/keqbu2v4inoqz/search_or?Name=adam`,
// //     success: function (data) {
// //                console.log(" 1- Your country is " + data.Name);
// //                 Name = (data.Name);
// //      }, 
// //      async: false // <- this turns it into synchronous
// //    });



//     // var ans=
//     // `Ahsab ${data.Name} Your email is ${data[0].Email} and your phone number is ${data[0].Phone}. How can i help you?`
//     return agent.add(
//         `Ahsab ${Name} Your email is ${Email} and your phone number is ${Phone}. How can i help you?`
//     );

//     }let intents=new Map();
//     intents.set("details",details);
// _agent.handleRequest(intents);
// });

















