import React, { useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import InvoiceModal from "../components/InvoiceModal";
import { useNavigate } from "react-router-dom";
import { useInvoiceListData } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { deleteInvoice, bulkEdit } from "../redux/invoicesSlice";
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

const InvoiceList = () => {

  const [modalShow, setModalShow] = React.useState(false);
  const [editingField, setEditingField] = useState("");
  const { invoiceList, getOneInvoice } = useInvoiceListData();
  const isListEmpty = invoiceList.length === 0;
  const [copyId, setCopyId] = useState("");
  const navigate = useNavigate();
  const handleCopyClick = () => {
    const invoice = getOneInvoice(copyId);
    if (!invoice) {
      alert("Please enter the valid invoice id.");
    } else {
      navigate(`/create/${copyId}`);
    }
  };



  const [selectedInvoice, setSelectedInvoice] = useState({id: [], list:[]});
  const handleInvoiceSelect = (invoiceId, isChecked) => {
    let selectedInvoiceId = [...selectedInvoice?.id, invoiceId];
    let selectedInvoiceList = [...selectedInvoice?.list];
    if (isChecked) {
      invoiceList.forEach(invoice => {
        if (invoice?.id.toString() === invoiceId.toString()) selectedInvoiceList.push(invoice);
      });
      setSelectedInvoice({ id: selectedInvoiceId, list: selectedInvoiceList });
    }
    else {
      selectedInvoiceId = selectedInvoiceId.filter(id => id.toString() !== invoiceId.toString());
      selectedInvoiceList = selectedInvoiceList.filter(invoice => invoice?.id.toString() !== invoiceId.toString());
      setSelectedInvoice({ id: selectedInvoiceId, list: selectedInvoiceList });
    }
  }

  const handleBulkUpdate = (id, list) => {
    setSelectedInvoice({ id, list });
  }

  return (
    <>
    <Row>
      <Col className="mx-auto" xs={12} md={8} lg={9}>
        <h3 className="fw-bold pb-2 pb-md-4 text-center">Swipe Assignment</h3>
        <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
          {isListEmpty ? (
            <div className="d-flex flex-column align-items-center">
              <h3 className="fw-bold pb-2 pb-md-4">No invoices present</h3>
              <Link to="/create">
                <Button variant="primary">Create Invoice</Button>
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column">
              <div className="d-flex flex-row align-items-center justify-content-between">
                <h3 className="fw-bold pb-2 pb-md-4">Invoice List</h3>
                <Link to="/create">
                  <Button variant="primary mb-2 mb-md-4">Create Invoice</Button>
                </Link>
                <Dropdown className="mb-4">
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Bulk Edit
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1" onClick={() => { selectedInvoice?.id.length?setModalShow(true):alert("Select atleast one Invoice"); setEditingField("billTo") }}>Bill To</Dropdown.Item>
                    <Dropdown.Item href="#/action-2" onClick={() => { selectedInvoice?.id.length?setModalShow(true):alert("Select atleast one Invoice"); setEditingField("billFrom") }}>Bill From</Dropdown.Item>
                    <Dropdown.Item href="#/action-3" onClick={() => { selectedInvoice?.id.length?setModalShow(true):alert("Select atleast one Invoice"); setEditingField("dueDate") }}>Due Date</Dropdown.Item>
                    <Dropdown.Item href="#/action-3" onClick={() => { selectedInvoice?.id.length?setModalShow(true):alert("Select atleast one Invoice"); setEditingField("notes") }}>Notes</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <div className="d-flex gap-2">
                  <Button variant="dark mb-2 mb-md-4" onClick={handleCopyClick}>
                    Copy Invoice
                  </Button>

                  <input
                    type="text"
                    value={copyId}
                    onChange={(e) => setCopyId(e.target.value)}
                    placeholder="Enter Invoice ID to copy"
                    className="bg-white border"
                    style={{
                      height: "50px",
                    }}
                  />
                </div>
              </div>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Bill To</th>
                    <th>Due Date</th>
                    <th>Total Amt.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceList.map((invoice) => (
                    <InvoiceRow
                      handleInvoiceSelect={handleInvoiceSelect}
                      key={invoice.id}
                      invoice={invoice}
                      navigate={navigate}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Col>
      </Row>
      <MyVerticallyCenteredModal
        editingField={editingField}
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedInvoice={selectedInvoice}
        handleBulkUpdate={handleBulkUpdate}
      />
      </>
  );
};

const InvoiceRow = ({ invoice, navigate, handleInvoiceSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteClick = (invoiceId) => {
    dispatch(deleteInvoice(invoiceId));
  };

  const handleEditClick = () => {
    navigate(`/edit/${invoice.id}`);
  };

  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };



  return (
    <tr>
      <td><input type="checkbox" style={{marginRight: "10px"}} onChange={(e)=>handleInvoiceSelect(invoice.id, e.target.checked)}></input>{invoice.invoiceNumber}</td>
      <td className="fw-normal">{invoice.billTo}</td>
      <td className="fw-normal">{invoice.dateOfIssue}</td>
      <td className="fw-normal">
        {invoice.currency}
        {invoice.total}
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="outline-primary" onClick={handleEditClick}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiSolidPencil />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="danger" onClick={() => handleDeleteClick(invoice.id)}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiTrash />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="secondary" onClick={openModal}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BsEyeFill />
          </div>
        </Button>
      </td>
      <InvoiceModal
        showModal={isOpen}
        closeModal={closeModal}
        info={{
          isOpen,
          id: invoice.id,
          currency: invoice.currency,
          currentDate: invoice.currentDate,
          invoiceNumber: invoice.invoiceNumber,
          dateOfIssue: invoice.dateOfIssue,
          billTo: invoice.billTo,
          billToEmail: invoice.billToEmail,
          billToAddress: invoice.billToAddress,
          billFrom: invoice.billFrom,
          billFromEmail: invoice.billFromEmail,
          billFromAddress: invoice.billFromAddress,
          notes: invoice.notes,
          total: invoice.total,
          subTotal: invoice.subTotal,
          taxRate: invoice.taxRate,
          taxAmount: invoice.taxAmount,
          discountRate: invoice.discountRate,
          discountAmount: invoice.discountAmount,
        }}
        items={invoice.items}
        currency={invoice.currency}
        subTotal={invoice.subTotal}
        taxAmount={invoice.taxAmount}
        discountAmount={invoice.discountAmount}
        total={invoice.total}
      />
    </tr>
  );
};

function MyVerticallyCenteredModal(props) {

  const dispatch = useDispatch();

  const seletedInvoiceList = [...props?.selectedInvoice?.list];
  console.log(props?.selectedInvoice?.list);

  const bulkEditForm = () => {
    switch (props?.editingField) {
      case "billTo":
        return (
          <>
            <Form.Label className="fw-bold">Bill to:</Form.Label>
            <Form.Control
              placeholder="Who is this invoice to?"
              rows={3}
              type="text"
              name="billTo"
              className="my-2"
              autoComplete="name"
              required
              onChange={(e) => seletedInvoiceList.forEach((invoice, idx) => seletedInvoiceList[idx] = {...invoice, billTo: e.target.value})}
            />
            <Form.Control
              placeholder="Email address"
              type="email"
              name="billToEmail"
              className="my-2"
              autoComplete="email"
              required
              onChange={(e) => seletedInvoiceList.forEach((invoice, idx) => seletedInvoiceList[idx] = {...invoice, billToEmail: e.target.value})}
            />
            <Form.Control
              placeholder="Billing address"
              type="text"
              name="billToAddress"
              className="my-2"
              autoComplete="address"
              required
              onChange={(e) => seletedInvoiceList.forEach((invoice, idx) => seletedInvoiceList[idx] = {...invoice, billToAddress: e.target.value})}

            />
          </>
        )
      case "billFrom":
        return (
          <>
          <Form.Label className="fw-bold">Bill from:</Form.Label>
          <Form.Control
            placeholder="Who is this invoice from?"
            rows={3}
            type="text"
            name="billFrom"
            className="my-2"
            autoComplete="name"
              required
              onChange={(e) => seletedInvoiceList.forEach((invoice, idx) => seletedInvoiceList[idx] = {...invoice, billFrom: e.target.value})}

          />
          <Form.Control
            placeholder="Email address"
            type="email"
            name="billFromEmail"
            className="my-2"
            autoComplete="email"
            required
            onChange={(e) => seletedInvoiceList.forEach((invoice, idx) => seletedInvoiceList[idx] = {...invoice, billFromEmail: e.target.value})}

          />
          <Form.Control
            placeholder="Billing address"
            type="text"
            name="billFromAddress"
            className="my-2"
            autoComplete="address"
            required
            onChange={(e) => seletedInvoiceList.forEach((invoice, idx) => seletedInvoiceList[idx] = {...invoice, billFromAddress: e.target.value})}
            
          />
          </>
        )
      case "dueDate":
        return (
          <>
            <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
            <Form.Control
              type="date"
              name="dateOfIssue"
              style={{ maxWidth: "150px" }}
              required
              onChange={(e) => seletedInvoiceList.forEach((invoice, idx) => seletedInvoiceList[idx] = {...invoice, dateOfIssue: e.target.value})}

            />
          </>
        )
      case "notes":
        return (
          <>
            <Form.Label className="fw-bold">Notes:</Form.Label>
            <Form.Control
              placeholder="Add Notes"
              name="notes"
              as="textarea"
              className="my-2"
              rows={1}
              onChange={(e) => seletedInvoiceList.forEach((invoice, idx) => seletedInvoiceList[idx] = {...invoice, notes: e.target.value})}


            />
          </>
        )
      default:
        <>

        </>
    }
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Bulk Edit
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {bulkEditForm()}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => {
          props.onHide();
          props.handleBulkUpdate(props?.selectedInvoice?.id, seletedInvoiceList);
          dispatch(bulkEdit({id: props?.selectedInvoice?.id, updatedInvoice: seletedInvoiceList}))
        }}>Update</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InvoiceList;
