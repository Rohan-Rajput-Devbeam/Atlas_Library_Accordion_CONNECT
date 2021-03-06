import * as React from 'react';

import { DefaultButton } from '@fluentui/react/lib/Button';
import { MYModal } from './MYMODAL';
import ManageDocModal from './ManageDocModal';

import styles from './AtlasLibraryConnect.module.scss';


import { escape } from '@microsoft/sp-lodash-subset';

import { Collapse, Card } from 'bootstrap-4-react';
import { SPService } from '../Services/SPServices';
import FileIconContext from './FileIconContext';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ThemeSettingName } from 'office-ui-fabric-react';
import { IoMdDownload, IoIosMail, IoIosStarOutline, IoIosArrowForward } from "react-icons/io";


import {
  ColorPicker,
  IChoiceGroupOption,
  IColor,
  IColorPickerStyles,
  SwatchColorPicker,
  Label,
} from 'office-ui-fabric-react/lib/index';

import Gradient from "javascript-color-gradient";
import { sp, ClientsidePageFromFile, Web } from "@pnp/sp/presets/all";


import {
  SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions
} from '@microsoft/sp-http';
import "@pnp/sp/webs";
import "@pnp/sp/folders";




var colorArray = [];
export interface IAtlasLibraryConnectState {
  docItems: any;
  categories: any;
  currPageUrl: any;
  currUserGroups: any;
  displayFlag: boolean;
  callchildcomponent: boolean;
  swatchcolor: any;
  previewColor: any;
  color: any;



}




export interface IAtlasLibraryConnectProps {
  description: string;
  context: WebPartContext;
  people: any;
  gradientColor1: any;
  gradientColor2: any;


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
      displayFlag: false,
      callchildcomponent: false,
      swatchcolor: [],
      previewColor: "",
      color: "",


    }
    this.handler = this.handler.bind(this);
    this.Buttonclick = this.Buttonclick.bind(this);


    // console.log(this.state.currPageUrl)
    this.selectIcon = this.selectIcon.bind(this);

    //this.props.people
  }


  handler() {
    this.setState({
      callchildcomponent: false
    })
  }
  private Buttonclick(e) {
    e.preventDefault();

    this.setState({ callchildcomponent: true });


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
    // this.rackName = "Rack1649273338733"

    // console.log(this.rackName);

    // this.hrefString = `https://devbeam.sharepoint.com/sites/ModernConnect/Rackhouse%20Documents/${this.rackName}`;
    // this.hrefString = `https://bgsw1.sharepoint.com/sites/CONNECTII/Rackhouse%20Documents/Rack1646754094655`;
    this.hrefString = `https://bgsw1.sharepoint.com/sites/CONNECTII/Rackhouse%20Documents/${this.rackName}`;

    // console.log(this.hrefString);
    this.getUserGroups2();
    this.getAllDocs2();

  }

  public async getAllDocs2() {
    let allDocs = await this.SPService.getAllDocs();
    // console.log(allDocs);

    this.setState({
      docItems: allDocs,

    });
    // console.log(this.state.docItems);
    this.categorize();

    // console.log(this.state.allItems);


    // console.log(this.state.renderedItems);
  }

  public async getUserGroups2() {

    let usrGroups = await this.SPService.getUserGroups();
    // console.log(usrGroups);
    this.setState({
      currUserGroups: usrGroups,

    });
    // console.log(this.state.currUserGroups);

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
    // console.log(listItemsMapping)
    // console.log(categories)
    this.setState({
      ...this.state,
      categories: categories.sort()
    });
    // console.log(this.state.categories.length);

  }

  public async categorizeGroups() {
    this.setState({
      displayFlag: false
    })
    let response = this.state.currUserGroups;
    var finalArray = response.value.map(function (obj: { Title: any; }) {
      return obj.Title;
    });  //get user groups...
    // const GroupArray = this.props.people.map((obj: { fullName: any; }) => {
    //   return obj.fullName;
    // });
    const GroupArray = this.props.people.map((obj: { email: any; }) => {
      return obj.email;
    });

    // var usrFullname = this.context.pageContext.user.displayName;
    // var usrFullname = "Rohan Rajput";
    let usrFullname = await (await sp.web.currentUser()).Email;
    // console.log(usrFullname)

    var Groupintersections = finalArray.filter(e => GroupArray.indexOf(e) !== -1);

    // console.log(finalArray);
    // console.log(this.props.people);
    for (let i = 0; i < this.props.people.length; i++) {
      // console.log(this.props.people[i].fullName);
      if (finalArray.includes(this.props.people[i].fullName) || GroupArray.includes(usrFullname) || Groupintersections.length > 0) {
        // console.log("User Can view this section...!!");
        this.setState({
          displayFlag: true
        })
      }
    }

  }

  public render(): React.ReactElement<IAtlasLibraryConnectProps> {

    // var siteUrl = this.context.pageContext.web.absoluteUrl ///Get Site Url
    // console.log(siteUrl)

    // const myArray = siteUrl.split("/");
    // let siteName = myArray[myArray.length - 1].split(".")[0]; ///Get Site Name
    // console.log(siteName)

    // console.log(this.props.people);
    // console.log(this.state.swatchcolor);

    const colorGradient = new Gradient();
    const color1 = `${this.props.gradientColor1}`;
    const color2 = `${this.props.gradientColor2}`;
    colorGradient.setGradient(color1, color2);
    colorGradient.setMidpoint(this.state.categories.length);
    // console.log(color1);
    // console.log(color2);

    //this.getUserGroups2();
    let a = "0";

    var options = { year: 'numeric', month: 'long', day: 'numeric' };

    return (

      <div className={styles.atlasLibraryConnect}>
        <div id="accordionExample">
          {this.state.categories.map((categoryDetail: string, i: any) => (
            <Card>
              <Card.Header mb="0" /*style={{ backgroundColor: `${colorGradient.getColor(i + 1)}` }}*/ className={styles.CardHeader} >
                {/* <label htmlFor={`cb${i}`}>Click here to toggle checkbox</label>
                   <input type="checkbox" id={`cb${i}`} />  */}
                <Collapse.Button className={styles.CollapseButton}
                  link target={`#collapse${i}`}
                  id={`heading${i}`} aria-expanded="false">
                  {categoryDetail != null && categoryDetail != "" ? categoryDetail : "Other's"}


                </Collapse.Button>
              </Card.Header>

              <Collapse id={`collapse${i}`} aria-labelledby={`heading${i}`} className={a = i ? "hide" : "show"} data-parent="#accordionExample">
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
                                <a target="_blank" data-interception="off" rel="noopener noreferrer" href={itemDetail.ListItemAllFields.ServerRedirectedEmbedUri != null && itemDetail.ListItemAllFields.ServerRedirectedEmbedUri != "" ? itemDetail.ListItemAllFields.ServerRedirectedEmbedUri : itemDetail.ServerRelativeUrl}>
                                  <img src={this.selectIcon(itemDetail.Name)} width='30px' />

                                  <span className={styles.titleSpan} > {itemDetail.Name} </span>
                                </a>
                              </td>
                              <td>{new Date(itemDetail.ListItemAllFields.Modified).toLocaleDateString("en-US", AtlasLibraryConnect.dateOptions)}
                                {/* console.log(today.toLocaleDateString("en-US", options)); */}

                              </td>
                              <td><a style={{ marginLeft: "-28px" }} data-interception="off" href={`https://bgsw1.sharepoint.com/sites/CONNECTII/_layouts/download.aspx?SourceUrl=https://bgsw1.sharepoint.com` + itemDetail.ServerRelativeUrl} >
                                <IoMdDownload size={20} className={styles.downloadBut1} />
                                {/*<svg xmlns="https://bgsw1.sharepoint.com/:u:/s/CONNECTII/EVyda3UoA1dOpn3igwkln58BbkcQqozoGeWFhR8jLBVZhg?e=TatJ1o" width="16" height="16" fill="#CC0A0A" className="bi bi-download" viewBox="0 0 16 16">
                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                              </svg>*/}</a></td>
                              <td>
                                <a style={{ marginLeft: "-30px" }} href=''>
                                  <IoIosStarOutline size={20} className={styles.downloadBut1} />
                                </a>
                                {/* <img src="https://devbeam.sharepoint.com/sites/ModernConnect/SiteAssets/Logo/Icons/stars-hollow-png.png"></img> */}

                                {/* <h1 className={styles.live}></h1> */}

                              </td>
                              <td>
                                <a style={{ marginLeft: "-36px" }} className="share-link hidden-xs hidden-sm"
                                  href={`mailto:?subject=${itemDetail.Name}&ampbody=Open:%0D%0Ahttps://https://bgsw1.sharepoint.com/sites/CONNECTII/Rackhouse%20Documents/1.%2520CONNECT%2520Tutorial%2520(5.3.2021).mp4"><i className="fa icon-envelope`}>

                                  <IoIosMail size={20} className={styles.downloadBut1} />
                                </a>
                              </td>
                            </tr> :
                            null

                        ))}



                      </tbody>

                    </table>
                  </div>


                </Card.Body>
                {
                // this.state.displayFlag == true ?
                //   <a title="Color Picker" className={styles.colorPickerIcon} onClick={(e) => this.Buttonclick(e)}><img src="https://bgsw1.sharepoint.com/sites/CONNECTII/SiteAssets/Logo/Icons/color-picker.png"></img>
                //     {/* <DefaultButton onClick={(e) =>this.Buttonclick(e) } text="Color Picker Modal" /> */}
                //     {this.state.callchildcomponent && <MYModal myprops={this.state} handler={this.handler} />}
                //   </a> : 
                //   <br></br>
                  }


                {/* <div>
                  <h1>Swatch Color Picker with Dynamic Colors on Selection from Color Picker</h1>
                  <ColorPicker
                    color={this.state.color}
                    onChange={this._updateColor}
                    styles={colorPickerStyles}
                  />
                  <SwatchColorPicker
                    selectedId={this.state.previewColor}
                    onCellHovered={(id, color) => this.setState({ previewColor: color! })}
                    onColorChanged={(id, color) => this.setState({ previewColor: color! })}
                    columnCount={9}
                    cellShape={'circle'}
                    cellHeight={50}
                    cellWidth={50}
                    cellBorderWidth={3}
                    colorCells={
                      this.state.swatchcolor
                    }
                  />
                  <Label style={{
                    color: this.state.previewColor ? this.state.previewColor : "#000",
                    fontSize: '24px'
                  }}>Colorful Text on Hover and Change</Label>
                  <DefaultButton
                    text="Colorful Button"
                    style={{
                      backgroundColor: this.state.previewColor ? this.state.previewColor : "#fff",
                      fontSize: '24px',
                      border: '1px solid black'
                    }}
                  />
                </div> */}

              </Collapse>
            </Card>
          ))}



          <br></br>
          <br></br>

          {this.state.displayFlag == true ?
            <div>
              <ManageDocModal rackUrl={this.hrefString} />
              {/* <a target="_blank" data-interception="off" rel="noopener noreferrer" href={this.hrefString} id="rackButton" className={`btn btn-info ${styles.submitBtn}`} role="button">Go to Rackhouse content</a> */}

            </div>
            : <br></br>}

          {/* <div>{this.properties.people}</div> */}
        </div>
      </div>

    );
  }

  private _updateColor = async (ev: React.SyntheticEvent<HTMLElement>, colorObj: IColor) => {
    colorArray.shift();
    // colorArray.push({ ID: '#' + colorObj.hex, label: '#' + colorObj.hex, color: '#' + colorObj.hex });
    colorArray.push({ color: '#' + colorObj.hex });
    await this.setState({ swatchcolor: colorArray });
    console.log(colorArray);
    console.log(this.state.swatchcolor);


  }

}


const colorPickerStyles: Partial<IColorPickerStyles> = {
  panel: { padding: 12 },
  root: {
    maxWidth: 352,
    minWidth: 352,
  },
};



