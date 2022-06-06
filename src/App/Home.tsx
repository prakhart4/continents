import { Close, Info, Refresh } from '@mui/icons-material';
import { Alert, AppBar, Box, Button, Card, CircularProgress, Collapse, FormControl, IconButton, InputLabel, MenuItem, Popover, Select, Toolbar, Typography } from '@mui/material'
import { Container } from '@mui/system'
import {OperationVariables, useQuery} from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData, Continent } from './Provider/DataProvider';

type Props = {}

export default function Home({}: Props) {
    const navigate = useNavigate();
    const {client, allContinents} = useData()
    const [selection, setSelection] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const {data, loading, error, refetch} = useQuery<{continents:[Continent]}, OperationVariables>(allContinents, {client});

    useEffect(() => {
      return () => {
        setSelection('');
        setAlertMessage('');
        setAnchorEl(null)
      }
    }, [])
    
    const handleExplore = ()=>{
        (!selection)
        ?setAlertMessage('Please select a Continent')
        :navigate({pathname:'/continent',search:`?code=${selection}`},{state:data?.continents?.find((v:any)=>v.code===selection)})
    }
    
    const handleInfo = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <Box display={'flex'} flexDirection='column' minHeight={'100vh'}>
            <AppBar>
                <Toolbar>
                    <Box
                    component={'img'}
                    bgcolor='white'
                    p={.5}
                    borderRadius={1.5}
                    src='./logo.png'
                    height="auto"
                    width="100px"
                    mr={2}
                    />
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign:'center' }}>
                        Continents
                    </Typography>
                    <Box width={"100px"} textAlign={'right'}>
                        <IconButton
                            edge='end'
                            id='info-Button'
                            size="large"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleInfo}
                        >
                            <Info />
                        </IconButton>
                        <Popover
                            id={'Information'}
                            open={!!anchorEl}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                            }}
                        >
                            <Typography sx={{ p: 2, maxWidth:200}}>An assignment for salesbeat that  shows a list of countries in a continent</Typography>
                        </Popover>
                    </Box>
                </Toolbar>
            </AppBar>
            {<Collapse in={!!alertMessage||!!error}>
                <Toolbar/>
                {error&&<Alert
                severity="error"
                action={
                    <IconButton
                    id='refresh-Button'
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        refetch();
                    }}
                    >
                    <Refresh fontSize="inherit" />
                    </IconButton>
                }>
                    {error.message}
                </Alert>}
                {alertMessage&&<Alert
                severity="warning"
                action={
                    <IconButton
                    id='close-Button'
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setAlertMessage('');
                    }}
                    >
                    <Close fontSize="inherit" />
                    </IconButton>
                }
                >
                    {alertMessage}
                </Alert>}
            </Collapse>}
            <Container component='main' sx={{display:'flex', flex:1, alignItems: 'center'}}>
                <Card sx={{p:3,flexGrow:1, mx:2, borderRadius:3}} elevation={12}>
                    <Typography variant='h4' mb={3}>
                        Choose a continent:
                    </Typography>
                    <Box display={'flex'} flexDirection={{xs:'column',md:'unset'}}>
                        <FormControl size='small' sx={{flex:1, mr:{xs:'unset',md:2}, mb:{xs:2,md:'unset'}}}>
                        <InputLabel size='small' id="Cotinent-selector">Continent</InputLabel>
                        <Select
                        label={'Continent'}
                        placeholder='Continent'
                        onClick={()=>setAlertMessage('')}
                        id='continent-selector'
                        size={'small'}
                        value={selection}
                        onChange={e=>setSelection(e.target.value)}
                        >
                            {loading&&<CircularProgress sx={{ml:2}} />}
                            <MenuItem value={''} key={'empty'}>None</MenuItem>
                            {data?.continents?.map((v,index:number)=><MenuItem value={v.code} key={index+v.code}>{v.name}</MenuItem>)}
                        </Select>
                        </FormControl>
                        <Button id='search-button' variant={'contained'} onClick={handleExplore}>
                            Explore
                        </Button>
                    </Box>
                </Card>
            </Container>
        </Box>
    )
}