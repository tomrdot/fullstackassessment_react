import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import ProductsList from './components/products/ProductsList';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { Avatar, Breadcrumb, Layout, Menu, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ProductForm from './components/products/ProductForm';

const { Header, Footer, Sider, Content } = Layout;
const { Text } = Typography;

function App() {
  const [selectedKey, setSelectedKey] = useState('/');

  useEffect(() => {
    setSelectedKey(window.location.pathname);
  }, []);

  return (
    <Router>
      <Layout>
        <Header className="header" style={{ position: 'fixed', width: '100%', zIndex: 1 }}>
          <div className="logo">
            <Link to="/" onClick={() => setSelectedKey('/')}><img src={logo} alt="Logo" style={{ height: '32px' }} /></Link>
          </div>
          <Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey]} style={{ flex: 1 }}>
            <Menu.Item key="/products">
              <Link to="/products" onClick={() => setSelectedKey('/products')}>Products</Link>
            </Menu.Item>
            {/* <Menu.Item key="/brands">
              <Link to="/brands" onClick={() => setSelectedKey('/brands')}>Brands</Link>
            </Menu.Item> */}
          </Menu>
          <div className="user-info">
            <Text style={{ color: 'white', marginRight: '10px' }}>Tom R.</Text>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Header>

        <Content style={{ padding: '0 50px', marginTop: '100px' }}>
          <Routes>
            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/:id" element={<ProductForm />} />
            {/* <Route path="/brands" element={<ProductForm />} /> */}
          </Routes>
        </Content>

        <Footer style={{ textAlign: 'center' }}>Sample Fullstack Assessment by Tom R.</Footer>
      </Layout>
    </Router>
  );
}

export default App;