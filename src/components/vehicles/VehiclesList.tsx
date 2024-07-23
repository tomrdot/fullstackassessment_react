import React, { useState, useEffect } from 'react';
import axios from '../../api/config';
import { Button, message, Modal, Pagination, Space, Table } from 'antd';
import { Input } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery, setPageQuery } from '../../redux/vehiclesSlice';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { confirm } = Modal;

type Vehicle = {
  id: number;
  dvid: string;
  lockStatus: string;
  currentSpeedInKm: number;
  batteryLevel: number;
  status: string;
  location: string;
  Vehicle_Type: {
    title: string
  };
};

const VehiclesList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('dvid');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [visible, setVisible] = useState(false);

  // REDUX STATE LOAD
  const searchTerm  = useSelector((state:any) => state.vehicles.searchQuery);
  const currentPage = useSelector((state:any) => state.vehicles.pageQuery);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, [searchTerm, currentPage, sortBy, sortOrder]);

  const fetchVehicles = async () => {
    setLoading(true);
    axios.get(`/vehicles`, {
      params: {
        search: searchTerm,
        page: currentPage,
        limit: 20,
        sortBy: sortBy,
        sortOrder: sortOrder
      }
    })
    .then(response => {
      setVehicles(response.data.vehicles);
      setTotalPages(response.data.totalPages);
      setLoading(false);
      
      if(currentPage > response.data.totalPages) {
        dispatch(setPageQuery(currentPage-1 as any))
      }
    })
    .catch(error => {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    });
  };

  const handleSearchChange = (event:any) => {
    dispatch(setSearchQuery(event.target.value));
    dispatch(setPageQuery(1 as any));
  };

  const handlePageChange = (page: any) => {
    dispatch(setPageQuery(page));
  };

  const handleTableChange = (pagination:any, filters:any, sorter:any) => {
    if (sorter.order) {
      setSortBy(sorter.field);
      setSortOrder(sorter.order == 'ascend'? 'ASC': 'DESC');
    } else {
      setSortBy('name');
      setSortOrder('ASC');
    }
  };

  const showDeleteConfirm = (record:any) => () => {
    confirm({
      title: `Are you sure you want to delete item: ${record.name}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This soft-delete action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        handleDelete(record.id); 
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleDelete = (id:any) => {
    setLoading(true);
    axios.delete(`/products/${id}`)
    .then(response => {
      setLoading(false);
      message.success('Product deleted successfully')
      fetchVehicles();
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      setLoading(false);
    });
  };

  const columns = [
    {
      title: <div className="flex justify-center items-center">No.</div>,
      dataIndex: 'key',
      key: 'no',
      render: (text:any, record:any, index:any) => (
        <div className="flex justify-center items-center">
          <a><h2>{index + 1}</h2></a>
        </div>
      ),
    },
    {
      title: <div className="flex justify-center items-center">Vehicle ID</div>,
      dataIndex: 'dvid',
      key: 'dvid',
      sorter: true,
      render: (text:any, record:any, index:any) => (
        <div className="flex justify-center items-center">
          <a><h2>{text}</h2></a>
        </div>
      ),
    },
    {
        title: <div className="flex justify-center items-center">Type</div>,
        dataIndex: 'Vehicle_Type',
        key: 'Vehicle_Type',
        sorter: true,
        render: (text:any, record:any, index:any) => (
            <div className="flex justify-center items-center">
              <h2>{text.title}</h2>
            </div>
        ),
      },
    {
        title: <div className="flex justify-center items-center">Lock/Unlock</div>,
        dataIndex: 'lockStatus',
        key: 'lockStatus',
        render: (text:any, record:any, index:any) => (
            <div className="flex justify-center items-center">
              <h2>{text}</h2>
            </div>
        ),
    },
    {
        title: <div className="flex justify-center items-center">Current Speed</div>,
        dataIndex: 'currentSpeedInKm',
        key: 'currentSpeedInKm',
        render: (text:any, record:any, index:any) => (
            <div className="flex justify-center items-center">
                <h2>{text} km/h</h2>
            </div>
        ),
    },
    {
        title: <div className="flex justify-center items-center">Battery Level</div>,
        dataIndex: 'batteryLevel',
        key: 'batteryLevel',
        render: (text:any, record:any, index:any) => (
            <div className="flex justify-center items-center">
                <h2>{text}%</h2>
            </div>
        ),
    },
    {
        title: <div className="flex justify-center items-center">Status</div>,
        dataIndex: 'status',
        key: 'status',
        render: (text:any, record:any, index:any) => (
            <div className="flex justify-center items-center">
                <h2>{text}</h2>
            </div>
        ),
    },
    {
        title: <div className="flex justify-center items-center">Location</div>,
        dataIndex: 'location',
        key: 'location',
        render: (text:any, record:any, index:any) => (
            <div className="flex justify-center items-center">
                <h2>{text}</h2>
            </div>
        ),
      },
      {
        title: <div className="flex justify-center items-center">Last Updated</div>,
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (text:any, record:any, index:any) => (
            <div className="flex justify-center items-center">
                <h2>{text}</h2>
            </div>
        ),
      },
    {
        title: <div className="flex justify-center items-center">Action</div>,
        key: 'action',
        render: (text:any, record:any, index:any) => (
            <div className="flex justify-center items-center">
                <Space size="middle">
                    <a onClick={()=> navigate('/vehicles/'+record.id)}><EditOutlined /> Edit</a>
                    <a className='warning' onClick={showDeleteConfirm(record)}><DeleteOutlined /> Delete</a>
                </Space>
            </div>
        ),
    },
  ];
  

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-4xl font-bold my-4">Viewing All Vehicles</h1>
          <Space className="space-x-2">
            <Input.Search
              className="my-4 mx-4"
              placeholder="Search by ID or type"
              defaultValue={searchTerm}
              onChange={handleSearchChange}
              enterButton={<SearchOutlined />}
            />
          </Space>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={()=>navigate('/vehicles/add')}>
          New Vehicle
        </Button>
      </div>

      <Table className="mt-8" 
        columns={columns} 
        loading={loading} 
        dataSource={vehicles} 
        pagination={false} 
        onChange={handleTableChange} 
      />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <Pagination
          current={currentPage}
          total={totalPages * 20}
          onChange={handlePageChange}
          pageSize={20}
          style={{ float: 'right' }}
        />
      </div>


      <Modal
          title="Delete Vehicle"
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          okText="Yes"
          cancelText="No"
          okType="danger"
        >
          <p>Are you sure you want to delete this item?</p>
      </Modal>
    </>
  );
};

export default VehiclesList;
