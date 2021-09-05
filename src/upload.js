import React, { useState } from "react";
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

var PDF_EXTRACT_URL = "http://localhost:5234/meta_extract_pdf"

function FileUploadPage(){
	const [selectedFile, setSelectedFile] = useState();
    const [metadata, setMetadata] = useState();
    const [documentName, setDocumentName] = useState();
    const [agreementDate, setAgreementDate] = useState();
    const [effectiveDate, setEffectiveDate] = useState();
    const [governingLaw, setGoverningLaw] = useState();
    const [parties, setParties] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfS3Url, setPdfS3Url] = useState();

    
	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
        setMetadata();
	};

	const handleSubmission = () => {
        const formData = new FormData();
        formData.append('file', selectedFile);
        setIsProcessing(true)
        fetch(
			PDF_EXTRACT_URL,
			{
				method: 'POST',
				body: formData,
			}
		)
			.then((response) => response.json())
			.then((result) => {
				setMetadata(result)
                setDocumentName(result.metadata.document_name)
                setParties(result.metadata.parties)
                setAgreementDate(result.metadata.agreement_date)
                setEffectiveDate(result.metadata.effective_date)
                setGoverningLaw(result.metadata.governing_law)
                setPdfS3Url(result.metadata.pdf_url)
                setIsProcessing(false)
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

    return(    
        <>
        <div className="file-input">                
        <p>Select a file</p>
        <input type="file" name="file" onChange={changeHandler} />
        <button onClick={handleSubmission}>Submit</button>
        {metadata ? (
            <div className="fields">
                {/* Document Name: {documentName}
                Parties: {parties} */}
                <ul>
                <li>Document Name: {documentName}</li>
                <li>Parties: {parties}</li>
                <li>Agreement Date: {agreementDate}</li>
                <li>Effective Date: {effectiveDate}</li>
                <li>Governing Law: {governingLaw}</li>
                </ul>
            </div>
        ) : (
            <></>
        )}  
        {/* {isProcessing ? (
            <div >Processing...</div>
        ) : (<div></div>)
        }   */}
        </div>        
            {pdfS3Url ? (
                <div className="pdf">
                    <Document
                        file={pdfS3Url}
                    >
                        <Page pageNumber={pageNumber}/>
                    </Document>
                    <button onClick={() => setPageNumber(pageNumber+1)}>
                        Next page
                    </button>
                </div>
            ) : (
                <></>
            )
            }
    </>
    )

}

export default FileUploadPage;