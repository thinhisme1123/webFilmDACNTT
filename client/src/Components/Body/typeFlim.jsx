import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import '../../Style/BodyCss/Home.css'
import '../../Style/All/grid.css'
import '../../Style/Responsive/Responsive.css'
import fetchingApiData from '../../Ultil/FetchingData/FetchingApi'
import Pagination from '../Pagination/Pagination';
import { useHandleClickFilmDetail } from '../../Ultil/Hepler/navigationHelpers';
import { useHandleTruncateText } from '../../Ultil/Hepler/truncateText'

function TypeFilm() {
    const { slug } = useParams();
    const [film, setFilm] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataFilm, setDataFilm] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [isNew, setIsNew] = useState(true);
    const totalPages = 30;
    const imgUrl = 'https://img.phimapi.com/'
    const hanldeClickFilmDetail = useHandleClickFilmDetail();
    const hanldeTruncateText = useHandleTruncateText()

    // const [movies, setMovies] = useState([]);

    // // Fetch data from the server
    // useEffect(() => {
    //     axios.get('http://localhost:5000/danh-sach/phim-le')
    //         .then(response => {
    //             setMovies(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //         });
    // }, []);
    useEffect(() => {
        if (slug !== "phim-moi-cap-nhat") {
            setIsNew(false)
        }
        const fetchData = async () => {
            setLoading(true)
            try {
                const baseUrl = isNew ? '' : 'v1/api/'; // Conditional URL part based on isNew
                const url = `https://phimapi.com/${baseUrl}danh-sach/${slug}?limit=12&page=${currentPage}`;

                const [phimData] = await fetchingApiData([url]);
                if (phimData) {
                    // Always set the full data
                    if (isNew) {
                        // If isNew is true, we don't need phimData.data.items
                        setFilm(phimData.items);
                    } else {
                        setDataFilm(phimData.data);
                        setFilm(phimData.data.items);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, [slug, currentPage,isNew])


    //mongo version
    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true)
    //         try {
    //             const [phimData] = await fetchingApiData([
    //                 `http://localhost:5000/api/danh-sach/${slug}`, //?limit=12&page=${currentPage}
    //             ]);
    //             console.log(phimData[0])
    //             if (phimData[0] && phimData[0].data.items) {
    //                 setDataFilm(phimData[0].data);
    //                 setFilm(phimData[0].data.items);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         } finally {
    //             setLoading(false)
    //         }
    //     };

    //     fetchData();
    // },[slug,currentPage])

    useEffect(() => {
        document.title = dataFilm?.seoOnPage?.titlePage || 'Phim Bộ';
    }, [dataFilm]);



    return (
        <div>
            <div className="maincontainer">
                <div className="grid">
                    <div className="row header-container">
                        <div className="film-header-container">
                            <h1 className="film-item_header">{dataFilm?.seoOnPage?.titleHead || (isNew ? "Phim mới cập nhật" : "Đang tải phim")}</h1>
                        </div>
                    </div>
                    <div className='row'>
                        {loading ? (
                            <div className="loading-container">
                                <div className="loading-item">
                                    <FontAwesomeIcon className='icon-loading' icon={faSpinner} spin size="3x" />
                                    <h2 className='mt-3'>Thông cảm! Đợi chút nha...</h2>
                                </div>
                            </div>
                        ) : (
                            film && film.map(item => (
                                <div key={item._id} onClick={() => hanldeClickFilmDetail(item.slug)} className="film-item col col-lg-2 col-md-4">
                                    <div className="film-item-img-container">
                                        <img
                                            src={isNew ? item.poster_url : imgUrl + item.poster_url}
                                            alt={item.name}
                                        />

                                    </div>
                                    <div className="film-item-iconplay">
                                        <FontAwesomeIcon className='fa-circle-play' icon={faCirclePlay} />
                                    </div>
                                    <h4>{hanldeTruncateText(item.name)}</h4>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="row pageNum-container">
                        <div className="film-pageNum-continer">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TypeFilm