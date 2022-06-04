import { useQuery } from '@apollo/client';
import { ArrowBack, FormatTextdirectionLToR, FormatTextdirectionRToL, Home } from '@mui/icons-material';
import { AppBar, Box, Card, CardContent, CardHeader, Chip, CircularProgress, Container, Divider, Grid, IconButton, Toolbar, Typography } from '@mui/material'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from './Provider/DataProvider';

type Props = {}

export default function Continent({}: Props) {
    const navigate = useNavigate();
    const {client, countrienByCode} = useData();
    const {state}:{state:any} = useLocation()
    let [searchParams, setSearchParams] = useSearchParams();
    const {data, loading, error} = useQuery(countrienByCode(searchParams.get('code')), {client});
  
    return (
        <Box display={'flex'} flexDirection='column' minHeight={'100vh'}>
            <AppBar position={'sticky'}>
                <Toolbar>
                    <IconButton
                        size="large"
                        color="inherit"
                        aria-label="Back"
                        onClick={()=>navigate(-1)}
                    >
                        <ArrowBack/>
                    </IconButton>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign:'center' }}>
                        {state?.name}
                        {state?.code&&`(${state?.code})`}
                    </Typography>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="Home"
                        onClick={()=>navigate('/',{replace:true})}
                    >
                        <Home />
                    </IconButton>
                </Toolbar>
            </AppBar>
            
            <Grid container p={4} spacing={{ xs: 2, md: 3 }}>
                {data?.countries?.map((v:any,index:number)=>
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{height:'100%', borderRadius:5}} elevation={5}>
                            <CardHeader title={v.name} subheader={v.code} />
                            <Divider/>
                            <CardContent sx={{display:'flex', overflow:'overlay'}}>
                                <Typography mt={1}>Currency:</Typography>
                                <Box flex={1}>
                                {v?.currency?.split(',')?.map((c:string)=><Chip label={c} sx={{mx:1, my:.5}}/>)||<Chip label='-' sx={{mx:1, my:.5}}/>}
                                </Box>
                            </CardContent>
                            <Divider/>
                            <CardContent sx={{display:'flex', overflow:'overlay'}}>
                                <Typography mt={1}>Capital:</Typography>
                                <Box flex={1}>
                                {v?.capital?<Chip label={v.capital} sx={{mx:1, my:.5}}/>:<Chip label='-' sx={{mx:1, my:.5}}/>}
                                </Box>
                            </CardContent>
                            <Divider/>
                            <CardContent sx={{ overflow:'overlay'}}>
                                <Typography mb={1}>Languages (<Typography display="inline" variant='caption'>Name/Native</Typography>) :</Typography>
                                <Box flex={1}>
                                    {
                                    v?.languages.length
                                    ?v?.languages?.map((l:any)=>
                                    <Chip
                                    icon={l.rtl?<FormatTextdirectionRToL/>:<FormatTextdirectionLToR/>}
                                    label={l.name+'/'+l.native}
                                    sx={{mx:1, my:.5}}
                                    />)
                                    :<Chip label='-' sx={{mx:1, my:.5}}/>
                                }
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
                {loading&&<Grid item xs={12} textAlign='center'><CircularProgress/></Grid>}
            </Grid>
        </Box>
    )
}