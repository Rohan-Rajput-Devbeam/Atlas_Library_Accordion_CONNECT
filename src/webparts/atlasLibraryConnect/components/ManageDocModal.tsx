import * as React from "react";
import { Button, Modal } from "bootstrap-4-react";
import autobind from 'autobind-decorator';
import styles from './AtlasLibraryConnect.module.scss';

import { Card } from "react-bootstrap";
import { Icon, IconButton } from "office-ui-fabric-react";



export default class ManageDocModal extends React.Component<any, any>{

    state = {
        show: false,
        setShow: false,
        
    }

    @autobind
    setShow(isOpen) {
        this.setState({
            show: isOpen
        })
    }

    render() {
    
        return (
            <>
                <div id="manageDocuments" className={styles.addDocuments}>

                    <Card className={styles.docCard}>
                        <Card.Header className={styles.docCardHeader}>
                            <a className="manage-docs btn btn-link" href="" type="button" data-toggle="modal" data-target="#document-modal" style={{ display: 'block', textAlign: 'left' }}>
                             Rackhouse Documents
                            </a>
                        </Card.Header>
                    </Card></div>

                <div className="modal fade in" id="document-modal" tabIndex={-1} role="dialog" aria-labelledby="document-modal" //style={{display: 'block', paddingLeft: '16px'}}
                >
                    <div className={`modal-dialog modal-lg ${styles.modalXl}`} role="document">
                        <div className="modal-content  modal-simple " style={{ height: '100%' }}>
                            <div className="modal-header" style={{ backgroundColor: '#CC0A0A', padding: '7px' }}>

                                {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="fa fa-times"></i></button> */}
                                <h4 className="modal-title" style={{ color: "white" }}>
                                    {/* <IconButton iconProps={{ iconName: 'Settings' }} title="Settings" ariaLabel="Settings" /> */}
                                    <Icon iconName="Settings" />
                                    {'  '} Rackhouse Documents
                                </h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <Icon style={{ color: 'white', padding: '8px' }} iconName="Cancel" />
                                    {/* <IconButton style={{color: 'white'}} iconProps={{ iconName: 'Cancel' }} title="Cancel" ariaLabel="Cancel" /> */}
                                </button>
                            </div>
                            <div className="modal-body" style={{ height: '100%' }}>
                                {/* <iframe src="/Program%20Documents/Forms/AllItems.aspx"></iframe> */}
                                <iframe src={this.props.rackUrl} width="100%" height="100%" />
                            </div>
                            <div className="modal-footer">
                                <div className="btn-container">
                                    <button type="button" id="btnCloseDocModal" className="btn btn-default" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }

}