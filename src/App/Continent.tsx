import { useQuery } from '@apollo/client';
import { ArrowBack, FormatTextdirectionLToR, FormatTextdirectionRToL, Home, Refresh } from '@mui/icons-material';
import { Alert, AppBar, Box, Card, CardContent, CardHeader, Chip, CircularProgress, Divider, Grid, IconButton, Toolbar, Typography } from '@mui/material'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useData, countrienByCode, countrienByCodeVariables } from './Provider/DataProvider';

type Props = {}

export default function Continent({}: Props) {
    const navigate = useNavigate();
    const {client, countrienByCode} = useData();
    const {state}:{state:any} = useLocation()
    let [searchParams] = useSearchParams();
    const {data, loading, error, refetch} = useQuery<countrienByCode, countrienByCodeVariables>(
        countrienByCode,
        {
            variables: {code : searchParams.get('code')||undefined},
            client:client
        }
    );
  
    return (
        <Box display={'flex'} flexDirection='column' minHeight={'100vh'}>
            <AppBar position={'sticky'}>
                <Toolbar>
                    <IconButton
                        edge='start'
                        id='back-Button'
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
                        edge='end'
                        id='home-Button'
                        size="large"
                        // edge="start"
                        color="inherit"
                        aria-label="Home"
                        onClick={()=>navigate('/',{replace:true})}
                    >
                        <Home />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Grid container p={4} spacing={{ xs: 2, md: 3 }}>
                {error&&<Grid item xs={12} textAlign='center'><Alert
                severity="error"
                action={
                    <IconButton
                    edge='end'
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
                </Alert></Grid>}
                {data?.countries?.map((v:any,index:number)=>
                    <Grid item xs={12} sm={6} md={3} key={index+v.name}>
                        <Card sx={{height:'100%', borderRadius:5}} elevation={5}>
                            <CardHeader title={v.name} subheader={v.code} />
                            <Divider/>
                            <CardContent sx={{display:'flex', overflow:'overlay', py:.5}}>
                                <Typography mt={1}>Currency:</Typography>
                                <Box flex={1}>
                                {v?.currency?.split(',')?.map((c:string)=><Chip key={c} label={c} sx={{mx:1, my:.5}}/>)||<Chip label='-' sx={{mx:1, my:.5}}/>}
                                </Box>
                            </CardContent>
                            <Divider/>
                            <CardContent sx={{display:'flex', overflow:'overlay', py:.5}}>
                                <Typography mt={1}>Capital:</Typography>
                                <Box flex={1}>
                                {v?.capital?<Chip label={v.capital} sx={{mx:1, my:.5}}/>:<Chip label='-' sx={{mx:1, my:.5}}/>}
                                </Box>
                            </CardContent>
                            <Divider/>
                            <CardContent sx={{ overflow:'overlay', py:.5}}>
                                <Typography mb={1}>Languages (<Typography display="inline" variant='caption'>Name/Native</Typography>) :</Typography>
                                <Box flex={1}>
                                    {
                                    v?.languages.length
                                    ?v?.languages?.map((l:any, index:number)=>
                                    <Chip key={l.name+index} 
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