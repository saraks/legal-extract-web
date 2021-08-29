import React, { useState } from "react";

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
                setIsProcessing(false)
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

    return(
        <div>
            <input type="file" name="file" onChange={changeHandler} />
            <button onClick={handleSubmission}>Submit</button>
                 {isFilePicked ? (
                     <div>
                         <p>Filename: {selectedFile.name}</p>
                     </div>
                 ) : (
                     <p>Select a file to show details</p>
                 )}
                {metadata ? (
                    <div class="field-value">
                         Document Name: {documentName}<br/> 
                         Parties: {parties}<br/> 
                         Agreement Date: {agreementDate}<br/> 
                         Effective Date: {effectiveDate}<br/> 
                         Governing Law: {governingLaw}<br/> 
                         </div>
                 ) : (
                    <div></div>
                 )}      
                 {isProcessing ? (
                     <div>Processing...</div>
                 ) : (<div></div>)
                 }          
            </div>
    )

}

export default FileUploadPage;