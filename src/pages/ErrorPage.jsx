import React, { useEffect } from 'react'
import Image from '../assets/404.gif'
import { useNavigate } from 'react-router-dom'

const ErrorPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate(-1)
    },10000)
    })

  return (
    <section className='flex flex-col items-center h-full w-full bg-gray-50'>
      <div className='w-4xl text-center bg-cover'>
        <img className=''
        src = {Image} alt= "Page not found"/>
        <h1 className='text-4xl'>404</h1> 
        <p>This page does not exist. You will be redirected to the previous page</p>
      </div>
    </section>
  )
}

export default ErrorPage