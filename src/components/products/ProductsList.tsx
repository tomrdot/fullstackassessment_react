import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from '../../api/config';
import { Button, message, Modal, Pagination, Row, Space, Table } from 'antd';
import { Input } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Barcode from 'react-barcode';
import logo from '../../logo.svg';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery, setPageQuery } from '../../redux/productsSlice';
import { useNavigate, useParams } from 'react-router-dom';

const { Search } = Input;
const { confirm } = Modal;

type Product = {
  id: number;
  name: string;
  price: number;
  upc12: string;
  Brand: {
    name: string
  };
};

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [visible, setVisible] = useState(false);

  // REDUX STATE LOAD
  const searchTerm = useSelector((state:any) => state.products.searchQuery);
  const currentPage = useSelector((state:any) => state.products.pageQuery);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, currentPage, sortBy, sortOrder]);

  const fetchProducts = async () => {
    setLoading(true);
    axios.get(`/products`, {
      params: {
        search: searchTerm,
        page: currentPage,
        limit: 20,
        sortBy: sortBy,
        sortOrder: sortOrder
      }
    })
    .then(response => {
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setLoading(false);
      
      if(currentPage > response.data.totalPages) {
        dispatch(setPageQuery(currentPage-1 as any))
      }
    })
    .catch(error => {
      console.error('Error fetching products:', error);
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
      fetchProducts();
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      setLoading(false);
    });
  };

  const columns = [
    {
      title: 'No.',
      dataIndex: 'key',
      key: 'no',
      render: (text:any, record:any, index:any) => <a><h2>{index + 1}</h2></a>,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text: any) => <Row><img src={logo} alt="product" style={{ width: '50px', height: '50px' }} /></Row>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text:any) => <h1>{text}</h1>,
    },
    {
      title: 'Brand',
      dataIndex: 'Brand',
      key: 'brand',
      sorter: true,
      render: (Brand:any) => <text>{Brand.name}</text>,
    },
    {
      title: 'Price (RM)',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'UPC12 Barcode',
      dataIndex: 'upc12',
      key: 'upc12',
      render: (upc12:any) => <div><Barcode height={30} value={upc12} /></div>,

    },
    {
      title: 'Action',
      key: 'action',
      render: (_:any, record:any) => (
        <Space size="middle">
          <a onClick={()=> navigate('/products/'+record.id)}><EditOutlined /> Edit</a>
          <a className='warning' onClick={showDeleteConfirm(record)}><DeleteOutlined /> Delete</a>
        </Space>
      ),
    },
  ];
  

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-4xl font-bold my-4">Viewing All Products</h1>
          <Space className="space-x-2">
            <Input.Search
              className="my-4 mx-4"
              placeholder="Search by brand or product"
              defaultValue={searchTerm}
              onChange={handleSearchChange}
              enterButton={<SearchOutlined />}
            />
          </Space>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={()=>navigate('/products/add')}>
          Add Product
        </Button>
      </div>

      <Table className="mt-8" 
        columns={columns} 
        loading={loading} 
        dataSource={products} 
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
          title="Delete Product"
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

export default ProductsList;
