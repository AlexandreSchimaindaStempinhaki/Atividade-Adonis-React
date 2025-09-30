import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Container } from 'react-bootstrap';
import { OrbitProgress } from "react-loading-indicators";
import NavigationBar from '../../components/navigationbar';
import DataTable from '../../components/datatable';
import { Client } from '../../api/client'
import UserContext from '../../contexts/UserContext'
import { getDataUser } from '../../service/UserService';
import { getPermissions } from '../../service/PermissionService';


export default function Home() {

    const [data, setData] = useState([])
    const [load, setLoad] = useState(true)
    const navigate = useNavigate();
    // const { user } = useContext(UserContext);
    const dataUser  = getDataUser()
    const permissions = getPermissions()

    function fetchData() {

        setLoad(true) 
        setTimeout(() => {
    
            Client.get('disciplinas').then(res => {
                const disciplinas = res.data.data
                console.log(disciplinas)

                const mapped = disciplinas.map(a => ({
                    ...a,
                    cursoNome: a.curso.nome
                }))
                setData(mapped)
            })
            .catch(function(error) {
                console.log(error)
                // alert('ERROR')
            })
            .finally( () => {
                setLoad(false)
            })

        }, 1000)
    }

    function verifyPermission() {
        // Não Autenticado   
        if(!dataUser) navigate('/login')
        // Não Autorizado (rota anterior)
        else if(permissions.listDisciplina === 0) navigate(-1)
    }

    useEffect(() => {
        verifyPermission()
        fetchData()
    }, []);

    return (
        <>
            <NavigationBar />
            {
                load 
                ?
                    <Container className="d-flex justify-content-center mt-5">
                        <OrbitProgress variant="spokes" color="#32cd32" size="medium" text="" textColor="" />
                    </Container>
                :
            
                <Container className='mt-2'>
                    <DataTable 
                        title="Disciplinas Registradas" 
                        rows={['Nome', 'Carga Horária (aulas)', 'Curso', 'Ações']}
                        hide={[false, true, false]}
                        data={data}
                        keys={['nome', 'carga', 'cursoNome']}
                        resource='disciplinas'
                        crud={['viewCurso', 'createCurso', 'editCurso', 'deleteCurso']}
                    />
                </Container>
            }
        </>
    )
}

