import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Space, Select, InputNumber, Alert, message, Col } from 'antd';
import axios from '../../api/config';
import Barcode from 'react-barcode';
import moment from 'moment';

const { Option } = Select;

type Product = {
    id: number;
    name: string;
    price: number;
    upc12: string;
    Brand: {
      name: string
    };
    createdAt: Date
  };

type Brand = {
    id: number;
    name: string;
    logoPath: string;
    productCount: number;
};

const ProductForm: React.FC = () => {
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [brands, setBrands] = useState<any>(null);
    const [barcode, setBarcode] = useState<any>();
    const [editForm] = Form.useForm();
    const isAdd = id && id != 'add' ? false: true

    const navigate = useNavigate();

    useEffect(() => {
        fetchBrands()
        if (id && !isAdd) {
            fetchProduct(id);
        }
    }, [id]);

    const fetchBrands = () => {
        setLoading(true);
        axios
        .get(`/brands`)
        .then((response) => {
            setBrands(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching brands:', error);
            setLoading(false);
        });
    };

    const fetchProduct = (id: string) => {
        setLoading(true);
        axios
        .get(`/products/${id}`)
        .then((response) => {
            setProduct(response.data);
            setBarcode(response.data.upc12)
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching product:', error);
            setLoading(false);
        });
    };

    const handleSave = () => {
        editForm.validateFields()
        .then(values => {
            !isAdd ? 
                axios.put(`/products/${id}`, values)
                .then(response => {
                    message.success('Product updated successfully.');
                    navigate('/products');
                })
                .catch(error => {
                    console.log('Error updating product:', error.response.data.error);

                    message.error(error.response.data.error as any)
                }) :

                axios.post(`/products`, values)
                .then(response => {
                    message.success('Product created successfully.');
                    navigate('/products');
                })
                .catch(error => {
                    message.error(error.response.data.error as any)
                    console.error('Error creating product:', error);
                })

        })
        .catch(error => {
            console.error('Validation failed:', error);
        });
    };

    // const handleCancel = () => {
    //     navigate('/products')
    // }

    const handleUpc12Change = (value:any) => {
        setBarcode(value);
      };

    if (id && id != 'add' && !product) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <Space className='space-x-1'>
            <Col>
            {product ? 
                <>
                    <h1 className="text-4xl font-bold my-4">Editing product: {product.name}</h1>
                    <h1>Product brand: {product.Brand.name}</h1>
                    <h1>Created date: {moment(product.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</h1>
                </> :
                <><h1 className="text-4xl font-bold my-4">Adding new product</h1></>
            }
            </Col>
        </Space>

        <Form form={editForm} layout="vertical" initialValues={product??undefined} className="mt-10 w-1/2">
            
            <Form.Item
                name="name"
                label="Product Name"
                rules={[{ required: true, message: 'Please enter product name' }]}
                >
                <Input />
            </Form.Item>

            <Form.Item
                name="brandId"
                label="Product Brand"
                rules={[{ required: true, message: 'Please select product brand' }]}
                >
                <Select>
                    {brands?.map((brand:Brand, index:any) => (
                        <Option key={index} value={brand.id}>
                        {brand.name} - {brand.productCount} items
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="price"
                label="Product Price"
                rules={[{ required: true, message: 'Please enter product price' }]}
                >
                <InputNumber
                    step={0.01} 
                    min={0}
                    placeholder="Enter product price"
                    style={{ width: '100%' }}
                    />
            </Form.Item>

            <Form.Item
                name="upc12"
                label="Product UPC12"
                rules={[{ required: true, message: 'Please enter product UPC12' },
                    {
                        validator: (_, value) =>
                            value && value.toString().length === 12
                                ? Promise.resolve()
                                : Promise.reject(new Error('UPC12 must be exactly 12 digits')),
                    }
                ]}
                >
                <InputNumber
                    step={1} 
                    min={0} 
                    placeholder="Enter product UPC12"
                    style={{ width: '100%' }}
                    onChange={handleUpc12Change}
                    />
            </Form.Item>

            
            {(product || barcode ) && <Barcode value={barcode} /> }
            
            <Form.Item style={{ marginTop: '16px' }}>
                <Space>
                    <Button type="primary" size="large" onClick={handleSave}>Save</Button>
                    <Button type="dashed" size="large" onClick={() => navigate('/products')}>Cancel</Button>
                </Space>
            </Form.Item>
        </Form>
        </>
    );
};

export default ProductForm;
