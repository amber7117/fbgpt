import { useSearchParams } from "react-router-dom"
import { useEffect } from "react"
import Loader from "../components/Loader"

const Process = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    console.log("++++++")
    useEffect(() => {
        const success = searchParams.get('success')
        const profileId = searchParams.get('profileId')
        if(success=='true'){
            fetch(`${process.env.REACT_APP_API_URL}/api/auth/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ profileId })
            }).then(response => response.json()).then(data => {
                alert(JSON.stringify(data))
                if(data.success){
                    window.location.href = '/manage'
                }else{
                    window.location.href = '/'
                }
            })
        }
    }, [])

    return (
        <>
            <Loader />
        </>
    )
}

export default Process