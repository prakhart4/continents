import { Close, Info } from '@mui/icons-material';
import { Alert, AppBar, Box, Button, Card, CircularProgress, Collapse, FormControl, Grid, IconButton, InputLabel, MenuItem, Popover, Select, Toolbar, Typography } from '@mui/material'
import { Container } from '@mui/system'
import {useQuery} from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from './Provider/DataProvider';

type Props = {}

export default function Home({}: Props) {
    const navigate = useNavigate();
    const {client, AllContinents} = useData()
    const [selection, setSelection] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const {data, loading, error} = useQuery(AllContinents, {client});

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
        :navigate({pathname:'/continent',search:`?code=${selection}`},{state:data.continents.find((v:any)=>v.code===selection)})
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
                        Continent Explorer
                    </Typography>
                    <Box width={"100px"} textAlign={'right'}>
                        <IconButton
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
                {error&&<Alert severity="error">{error.message}</Alert>}
                {alertMessage&&<Alert
                severity="warning"
                action={
                    <IconButton
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
                    <Box display={'flex'}>
                        <FormControl size='small' sx={{flex:1, mr:2,}}>
                        <InputLabel size='small' id="Cotinent-selector">Continent</InputLabel>
                        <Select
                        label={'Continent'}
                        placeholder='Continent'
                        onClick={()=>setAlertMessage('')}
                        id='Continent Selector'
                        size={'small'}
                        value={selection}
                        onChange={e=>setSelection(e.target.value)}
                        >
                            {loading&&<CircularProgress sx={{ml:2}} />}
                            <MenuItem value={''} key={'empty'}>None</MenuItem>
                            {data?.continents?.map((v:{name:string,code:string},index:number)=><MenuItem value={v.code} key={index+v.code}>{v.name}</MenuItem>)}
                        </Select>
                        </FormControl>
                        <Button variant={'contained'} onClick={handleExplore}>
                            Explore
                        </Button>
                    </Box>
                </Card>
            </Container>
        </Box>
    )
}