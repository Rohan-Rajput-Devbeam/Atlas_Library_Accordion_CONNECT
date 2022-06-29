import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from '@pnp/sp/presets/all';

import {
    SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions
} from '@microsoft/sp-http';
import "@pnp/sp/webs";
import "@pnp/sp/folders";



export class SPService {
    state = {

        allItems: [],
        currPageUrl: window.location.href,
        currUserGroups: []

    };

    public abc = [];
    rackName: string;
    people: [];
    authuser: boolean;

   

    constructor(private context: WebPartContext) {
        sp.setup({
            spfxContext: this.context
        });
        this.state = {
            allItems: [],
            currPageUrl: window.location.href,
            currUserGroups: []

        }
    }

    public async getUserGroups(){
        var finalArray:any[];
        let myGroups = await (await this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/Web/CurrentUser/Groups`,
            SPHttpClient.configurations.v1)).json();
    //    console.log(myGroups);
        
        return myGroups
            



    }

    public async getAllDocs() {
        var siteUrl = this.context.pageContext.web.absoluteUrl ///Get Site Url
        // console.log(siteUrl)
    
        const mySiteArr = siteUrl.split("/");
        let siteName = mySiteArr[mySiteArr.length - 1].split(".")[0]; ///Get Site Name
        // console.log(siteName)
    


        var items: any[];
        const myArray = this.state.currPageUrl.split("/");
        let rackName = myArray[myArray.length - 1].split(".")[0];
        this.rackName = myArray[myArray.length - 1].split(".")[0];
        // this.rackName = "Rack1649273338733"

        
                   

                    /*  if (this.people && this.people.length > 0) {
                         ///console.log(JSON.stringify(this.properties.people));
             
                         const GroupArray = this.people.map((obj: { fullName: any; }) => {
                           return obj.fullName;
                         });
                         ///console.log(GroupArray);//Array Of Group in property pane
                         console.log("Current User Present In The Group");
                         this.authuser=true;
                        // console.log(this.properties.authuser);
             
             
                       }
                       else {
                         // this.domElement.innerHTML = `
                                     // <div><h1>User does not have permission to view! </h1></div>`;
                         this.authuser=false;
             
                       } */
                       
                    
             

        


        try {
            // let requestUrl = `https://devbeam.sharepoint.com/sites/ModernConnect/_api/web/getfolderbyserverrelativeurl('Rackhouse%20Documents/${this.rackName}')/files?$expand=ListItemAllFields`

            let requestUrl = `${siteUrl}/_api/web/getfolderbyserverrelativeurl('Rackhouse%20Documents/${this.rackName}')/files?$expand=ListItemAllFields`

            let myItems = await (await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)).json();
            // console.log(myItems.value);
            // console.log(requestUrl);
            //  console.log(this.rackName);

            //Current page URL 
            //Split Url
          
            
            return myItems.value;
        }
        catch (err) {
            Promise.reject(err);
        }
    }
}

