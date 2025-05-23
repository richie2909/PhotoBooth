import  { useEffect, useState } from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import gsap from 'gsap'
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';


function Navigation() {

    const [show, setShow] = useState<boolean>(false)

    const showSideBar = () => {
        
       
        if (!show) {
            setShow(true)
            
        }
        else{
            setShow(false)
        }
        
    }

    useEffect(() => {
        gsap.fromTo("#nav", {
            y : -10,
            ease : ".out"

        },{
            display : "flex",
            y :0,
            duration : 0.2
        })
    },[])

    const items = [ "About", "Policy", "Contact", "Photos"]

  return (
    <div  id='nav' className='flex w-[90%] relative z-50 h-20 bg-gray-500 mx-[5%] mt-2 rounded-3xl justify-between border-1  border-pink-300 shadow-md shadow-purple-500 '>
        <h1 className='my-6 lg:mx-10 mx-5 text-pink-400 text-lg lg:text-xl ' style={{fontFamily : "pacifico"}}>SnapCharm</h1>

        <button className='mx-5 my-6 lg:hidden focus:outline-0' onClick={() => showSideBar()} >
        <RxHamburgerMenu size={25} className='text-pink-400 hover:text-blue-300 focus:text-blue-300'/>
        </button>
        <ul className=' my-6 gap-10  text-purple-300 hidden lg:flex'>
            {
                items.map((item, i) => {
                    return <Link to={`/${item}`} key={i} className='hover:text-pink-400
                    duration-500 ease-in-out
                    cursor-pointer
                    '> {item}</Link>
                })
            }
        </ul>


        <a  href="" className='my-5.5 hidden lg:flex hover:text-pink-400  cursor-pointer hover:border-pink-400   duration-500 ease-in-out mx-10 text-purple-300 border-1 border-purple-300 px-5 py-1 rounded-2xl pb-3 '>Download App </a>
     
        <div className=' absolute top-0 right-0'  >
        <Sidebar item={items} show={show}/>
        </div>
        

    </div>
  )
}

export default Navigation
