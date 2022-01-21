import * as React from 'react';
import styles from './AtlasLibraryConnect.module.scss';
//import { IAtlasLibraryConnectProps } from './IAtlasLibraryConnectProps';

import { escape } from '@microsoft/sp-lodash-subset';

import { Collapse, Card } from 'bootstrap-4-react';
import { SPService } from '../Services/SPServices';
import FileIconContext from './FileIconContext';
import { Button } from 'react-bootstrap';
//import "bootstrap/dist/css/bootstrap.min.css";

import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ThemeSettingName } from 'office-ui-fabric-react';


export interface IAtlasLibraryConnectState {
  docItems: any;
  categories: any;
  currPageUrl: any;
  currUserGroups: any;
  displayFlag: boolean;
}




export interface IAtlasLibraryConnectProps {
  description: string;
  context: WebPartContext;
  people: any;
}


export default class AtlasLibraryConnect extends React.Component<IAtlasLibraryConnectProps, IAtlasLibraryConnectState> {

  public SPService: SPService = null;

  static contextType = FileIconContext;

  public static dateOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    // dayPeriod: 'short' 
  } as const;
  rackName: string;
  hrefString: string;
  properties: any;


  public constructor(props: IAtlasLibraryConnectProps) {

    super(props);
    this.SPService = new SPService(this.props.context);
    this.rackName = "";
    this.hrefString = "";
    this.state = {
      docItems: [],
      categories: [],
      currPageUrl: window.location.href,
      currUserGroups: [],
      displayFlag: false

    }
    console.log(this.state.currPageUrl)
    this.selectIcon = this.selectIcon.bind(this);

    //this.props.people
  }

  componentDidUpdate() {
    // Typical usage (don't forget to compare props):
    if (this.props.people !== this.props.people) {
      this.getUserGroups2();
    }
  }

  public componentDidMount(): void {
    const myArray = this.state.currPageUrl.split("/");
    let rackName = myArray[myArray.length - 1].split(".")[0];
    this.rackName = myArray[myArray.length - 1].split(".")[0];

    console.log(this.rackName);

    this.hrefString = `https://devbeam.sharepoint.com/sites/ModernConnect/Rackhouse%20Documents/${this.rackName}`;
    console.log(this.hrefString);
    this.getUserGroups2();
    this.getAllDocs2();

  }

  public async getAllDocs2() {
    let allDocs = await this.SPService.getAllDocs();
    console.log(allDocs);

    this.setState({
      docItems: allDocs,

    });
    console.log(this.state.docItems);
    this.categorize();

    // console.log(this.state.allItems);


    // console.log(this.state.renderedItems);
  }

  public async getUserGroups2() {
    
    let usrGroups = await this.SPService.getUserGroups();
    console.log(usrGroups);
    this.setState({
      currUserGroups: usrGroups,

    });
    console.log(this.state.currUserGroups);

    this.categorizeGroups();
  }

  selectIcon(docName: any) {

    if (docName.toUpperCase().includes('.PDF')) {
      return this.context.pdfIcon;
    }
    else if (docName.toUpperCase().includes('.PPT')) {
      return this.context.powerpointIcon;
    }
    else if (docName.toUpperCase().includes('.DOC')) {
      return this.context.docxIcon;
    }
    else if (docName.toUpperCase().includes('.XLS')) {
      return this.context.excelIcon;
    }
    else if (docName.toUpperCase().includes('.JPG') || docName.toUpperCase().includes('.JPEG') || docName.toUpperCase().includes('.BMP') || docName.toUpperCase().includes('.PNG') || docName.toUpperCase().includes('.GIF')) {
      return this.context.imageIcon;
    }
    else if (docName.toUpperCase().includes('.MP4') || docName.toUpperCase().includes('.AVI') || docName.toUpperCase().includes('.3GP') || docName.toUpperCase().includes('.WMV') || docName.toUpperCase().includes('.MOV')) {
      return this.context.videoIcon;
    }
    else {
      return this.context.otherIcon;
    }
  }


  public categorize() {

    let listItemsMapping = this.state.docItems.map(e => ({
      category: e.ListItemAllFields.Category,
      //  name : e.Name
    }));
    // let xyz = [... new Set(listItemsMapping)]
    let categories = [...new Set(listItemsMapping.map(item => item.category))];
    console.log(listItemsMapping)
    console.log(categories)
    this.setState({
      ...this.state,
      categories: categories.sort()
    });
    console.log(this.state.categories.length);

  }

  public categorizeGroups() {
    this.setState({
      displayFlag: false
    })
    let response = this.state.currUserGroups;
    var finalArray = response.value.map(function (obj: { Title: any; }) {
      return obj.Title;
    });
    console.log(finalArray);
    console.log(this.props.people);
    for (let i = 0; i < this.props.people.length; i++) {
      console.log(this.props.people[i].fullName);
      if (finalArray.includes(this.props.people[i].fullName)) {
        console.log("User Can view this shit...!!");
        this.setState({
          displayFlag: true
        })
      }
    }

  }

 


  
  public render(): React.ReactElement<IAtlasLibraryConnectProps> {
    console.log(this.props.people);
   
    //this.getUserGroups2();
    let a = "0";

    



    var options = { year: 'numeric', month: 'long', day: 'numeric' };

    return (

      <div className={styles.atlasLibraryConnect}>

        <div id="accordionExample">
          {this.state.categories.map((categoryDetail: string, i: any) => (
            <Card>


              <Card.Header mb="0" className={styles.CardHeader} >
                {/* <label htmlFor={`cb${i}`}>Click here to toggle checkbox</label>
                   <input type="checkbox" id={`cb${i}`} />  */}
                <Collapse.Button className={styles.CollapseButton}
                  link target={`#collapse${i}`}
                  id={`heading${i}`} aria-expanded="false">
                  {categoryDetail != null && categoryDetail != "" ? categoryDetail : "Other's"}


                </Collapse.Button>
              </Card.Header>

              <Collapse id={`collapse${i}`} aria-labelledby={`heading${i}`}  className={a=i ?"hide":"show"}     data-parent="#accordionExample">
                <Card.Body>
                  <div className="table-responsive">
                    <table className="table">
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Modified Date</th>
                          <th scope="col">Download</th>
                          <th scope="col">Favorite</th>
                          <th scope="col">Share</th>
                        </tr>
                      </thead>
                      <tbody>

                        {this.state.docItems.map((itemDetail, i) => (

                          // {{this.state.featuredItems.length > 0 ? <h3>dfdfdf</h3>: null}}
                          categoryDetail == itemDetail.ListItemAllFields.Category ?

                            <tr>
                              <td>
                                <a href={itemDetail.ListItemAllFields.ServerRedirectedEmbedUri != null && itemDetail.ListItemAllFields.ServerRedirectedEmbedUri != "" ? itemDetail.ListItemAllFields.ServerRedirectedEmbedUri : itemDetail.ServerRelativeUrl}>
                                  <img src={this.selectIcon(itemDetail.Name)} width='30px' />

                                  <span className={styles.titleSpan} > {itemDetail.Name} </span>
                                </a>
                              </td>
                              <td>{new Date(itemDetail.ListItemAllFields.Modified).toLocaleDateString("en-US", AtlasLibraryConnect.dateOptions)}
                                {/* console.log(today.toLocaleDateString("en-US", options)); */}

                              </td>
                              <td><a href={itemDetail.ServerRelativeUrl} download> <svg xmlns="https://devbeam.sharepoint.com/:u:/s/ModernConnect/EVyda3UoA1dOpn3igwkln58BbkcQqozoGeWFhR8jLBVZhg?e=TatJ1o" width="16" height="16" fill="#CC0A0A" className="bi bi-download" viewBox="0 0 16 16">
                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                              </svg></a></td>
                              <td>
                                <img src="https://devbeam.sharepoint.com/sites/ModernConnect/SiteAssets/Logo/Icons/stars-hollow-png.png"></img>

                                {/* <h1 className={styles.live}></h1> */}

                              </td>
                              <td>
                                <a className="share-link hidden-xs hidden-sm"
                                  href={`mailto:?subject=${itemDetail.Name}&ampbody=Open:%0D%0Ahttps://devbeam.sharepoint.com/sites/ModernConnect/Rackhouse%20Documents/1.%2520CONNECT%2520Tutorial%2520(5.3.2021).mp4"><i className="fa icon-envelope`}><i className="fa icon-envelope" aria-hidden="true"></i>

                                  <div className={styles['letter-image']}>

                                    <div className={styles['animated-mail']}>
                                      <div className={styles['back-fold']}></div>
                                      <div className={styles.letter}>
                                        <div className={styles['letter-border']}></div>
                                        <div className={styles['letter-title']}></div>
                                        <div className={styles['letter-context']}></div>
                                        <div className={styles['letter-stamp']}>
                                          <div className={styles['letter-stamp-inner']}></div>
                                        </div>
                                      </div>
                                      <div className={styles['top-fold']}></div>
                                      <div className={styles.body}></div>
                                      <div className={styles['left-fold']}></div>
                                    </div>
                                    {/* {<div className={styles.shadow}></div>} */}
                                  </div>
                                </a>
                              </td>
                            </tr> :
                            null

                        ))}



                      </tbody>

                    </table>
                  </div>


                </Card.Body>
              </Collapse>
            </Card>
          ))}



          <br></br>
          <br></br>

{this.state.displayFlag == true ? 
    <div>
    {/* <a href="https://devbeam.sharepoint.com/sites/ModernConnect/Rackhouse Documents/Rack1641902403679">GoTo Rackhouse Folder</a> */}
    {/* <a target='_blank' href={`https://devbeam.sharepoint.com/sites/ModernConnect/Rackhouse%20Documents/${this.rackName}`}  rel="noopener noreferrer" id="rackButton" className={`btn btn-info ${styles.submitBtn}`} role="button">Go to Rackhouse content</a> */}
    <a href={this.hrefString} target='_blank' rel="noopener noreferrer" id="rackButton" className={`btn btn-info ${styles.submitBtn}`} role="button">Go to Rackhouse content</a>

  </div>
:<br></br>}
        
          {/* <div>{this.properties.people}</div> */}
        </div>
      </div>

    );
  }
 
}
