import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';


function Student() {
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [form_data, set_form_data] = useState({
        name: "",
        email: "",
        roll_no: ""
    });
    const [modal_form_data, set_modal_form_data] = useState({
        id:"",
        name: "",
        email: "",
        roll_no: ""
    });
    const [studentdata, setstudentdata] = useState();
    useEffect(() => {
        fetch(
            "http://localhost:8000/crudapp/readstudent/")
            .then((res) => res.json())
            .then((json) => {
                setstudentdata(json.data)
                // console.log(typeof studentdata)
            })
    }, [])

    const onInputChange = (e) => {
        set_form_data({ ...form_data, [e.target.name]: e.target.value })
    }
    const onModalInputChange = (e) => {
        set_modal_form_data({ ...modal_form_data, [e.target.name]: e.target.value })
    }
    const onFormSubmit = (e) => {
        e.preventDefault();
        console.log(form_data);
        fetch('http://localhost:8000/crudapp/createstudent/', {
            method: 'POST',
            body: JSON.stringify(form_data),
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            },
        })
            .then(() =>
                fetch(
                    "http://localhost:8000/crudapp/readstudent/")
                    .then((res) => res.json())
                    .then((json) => {
                        setstudentdata(json.data)
                    })
            )
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        console.log(modal_form_data);
        fetch('http://localhost:8000/crudapp/updatestudent/', {
            method: 'PATCH',
            body: JSON.stringify(modal_form_data),
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            },
        })
            .then(() =>
                fetch(
                    "http://localhost:8000/crudapp/readstudent/")
                    .then((res) => res.json())
                    .then((json) => {
                        setstudentdata(json.data)
                    })
            )
    }
    const rows = studentdata;
    const onEdit = (row) => {
        console.log(row.data.id);
        set_modal_form_data(
            {
                id:row.data.id,
                name:row.data.name,
                email:row.data.email,
                roll_no:row.data.roll_no
            })
        handleShow();
    }
    const onDelete = (row) =>{
        fetch('http://localhost:8000/crudapp/deletestudent/', {
            method: 'DELETE',
            body: JSON.stringify({id:row.data.id}),
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            },
        })
            .then(() =>
                fetch(
                    "http://localhost:8000/crudapp/readstudent/")
                    .then((res) => res.json())
                    .then((json) => {
                        setstudentdata(json.data)
                    })
            )
    }
    return (
        <div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={onModalFormSubmit}>
                        <div class="form-group">
                            <label>Id</label>
                            <input name="id" defaultValue={modal_form_data.id} onChange={onModalInputChange} type="text" className="form-control" id="id" placeholder="Enter Id" />
                        </div>
                        <div class="form-group">
                            <label>Name</label>
                            <input name="name" defaultValue={modal_form_data.name} onChange={onModalInputChange} type="text" className="form-control" id="name" placeholder="Enter name" />
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input name="email" defaultValue={modal_form_data.email} onChange={onModalInputChange} type="email" className="form-control" id="email" placeholder=" Enter email" />
                        </div>
                        <div class="form-group">
                            <label>Roll No</label>
                            <input name="roll_no" defaultValue={modal_form_data.roll_no} onChange={onModalInputChange} type="text" className="form-control" id="roll_no" placeholder=" Enter roll no" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            <div className='row'>
                <div className='col-md-6'>
                    <form onSubmit={onFormSubmit}>
                        <div class="form-group">
                            <label>Name</label>
                            <input onChange={onInputChange} name="name" type="text" className="form-control" id="name" placeholder="Enter name" />
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input onChange={onInputChange} name="email" type="email" className="form-control" id="email" placeholder=" Enter email" />
                        </div>
                        <div class="form-group">
                            <label>Roll No</label>
                            <input onChange={onInputChange} name="roll_no" type="text" className="form-control" id="roll_no" placeholder=" Enter roll no" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                <div className='col-md-6'>
                    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
                        <AgGridReact
                            rowData={rows}
                            rowSelection="multiple">
                            <AgGridColumn field="id" sortable={true} filter={true}></AgGridColumn>
                            <AgGridColumn field="name" sortable={true} filter={true}></AgGridColumn>
                            <AgGridColumn field="email" sortable={true} filter={true}></AgGridColumn>
                            <AgGridColumn field="roll_no" sortable={true} filter={true}></AgGridColumn>
                            <AgGridColumn field="action" cellRendererFramework={(params)=>(
                                <>
                                <button onClick={()=>onEdit(params)} className='btn btn-primary'>Edit</button>
                                <button onClick={()=>onDelete(params)} className='btn btn-danger'>Delete</button>
                                </>
                            )}></AgGridColumn>
                        </AgGridReact>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Student
