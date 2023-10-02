import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import Head from 'next/head';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import { FaRegUserCircle } from 'react-icons/fa';
import DropdownLink from './DropdownLink';
import { useSession, signOut } from 'next-auth/react';



export default function Layout({title, children}) {
  const {status, data: session} = useSession();
  const logoutClickHandler = () => {
    signOut({callbackUrl: "/login"});  
  }

  const username = session?.user?.username;

  return (
    <>
        <Head>
            <title>{title ? title: "Mono Telco-Data Quickstart App"}</title>
            <meta name='description' content='Created to showcase how to use the Mono Telco API'/>
            <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        </Head>

        <ToastContainer position='bottom-center' limit={1} />
        <div className='flex min-h-screen flex-col justify-between'>
        <header>
          <nav className='flex h-12 items-center px-4 justify-between shadow-md'>
            <Link href="/">
              <p className='text-lg font-bold text-paragraph'>Mono-Telco</p>
            </Link>

            <div className="flex items-center space-x-4">
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block z-10">
                  <Menu.Button className="pt-2" >
                    <span className="flex text-black">
                      <FaRegUserCircle size={24} className='mr-1 text-paragraph'/>
                      {username}
                    </span>
                  </Menu.Button>
                  <Menu.Items className="absolute origin-top-right right-0 w-56 bg-white shadow-lg rounded-md border">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href={`/profile`}>Profile</DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href={`/transactions`}>Transactions</DropdownLink>
                    </Menu.Item>
                    <hr/>
                    <Menu.Item>
                      <a className="dropdown-link" href="#" onClick={logoutClickHandler}>Logout</a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login" className='p-1 secondary-button mb-2'>Login</Link>
              )}
            </div>
          </nav> 
        </header>

        <main className='container m-auto mt-4 px-4'>
            {children}
        </main>

        <footer className='flex justify-center items-center h-10 shadow-inner'>
          <p>For Mono Technologies LTD</p>
        </footer>
        </div>
    </>
  );
}
