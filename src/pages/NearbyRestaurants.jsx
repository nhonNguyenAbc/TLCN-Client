import React, { useEffect, useRef, useState } from 'react';
import { useGetNearbyRestaurantsQuery } from '../apis/restaurantApi';
import { CircularProgress, Typography, Container, Box, Paper, TextField, Button } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import ProductCard from '../components/restaurant/ProductCard';

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const userLocationIcon = new L.Icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const restaurantIcon = new L.Icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

// Tùy chỉnh giao diện tiếng Việt cho leaflet-routing-machine
if (L.Routing && L.Routing.Localization) {
    L.Routing.Localization.vi = {
        directions: {
            N: 'Bắc',
            NE: 'Đông Bắc',
            E: 'Đông',
            SE: 'Đông Nam',
            S: 'Nam',
            SW: 'Tây Nam',
            W: 'Tây',
            NW: 'Tây Bắc',
            SlightRight: 'Rẽ nhẹ phải',
            Right: 'Rẽ phải',
            SharpRight: 'Rẽ phải gắt',
            SlightLeft: 'Rẽ nhẹ trái',
            Left: 'Rẽ trái',
            SharpLeft: 'Rẽ trái gắt',
            Uturn: 'Quay đầu'
        },
        instructions: {
            // Các hướng dẫn được dịch
            'Head': 'Đi {dir}',
            'Continue': 'Tiếp tục {dir}',
            'TurnAround': 'Quay đầu',
            'WaypointReached': 'Đã đến điểm dừng',
            'Roundabout': 'Đi vào vòng xoay và ra ở lối ra thứ {exitStr}',
            'DestinationReached': 'Đã đến điểm đến',
            'Fork': 'Tại ngã ba, rẽ {modifier}',
            'Merge': 'Nhập vào {modifier}',
            'OnRamp': 'Rẽ {modifier} vào đường nhánh',
            'OffRamp': 'Rẽ {modifier} ra khỏi đường nhánh',
            'EndOfRoad': 'Rẽ {modifier} cuối đường',
            'Onto': 'vào {road}'
        },
        ui: {
            // Các phần tử giao diện người dùng
            'StartPlaceholder': 'Điểm xuất phát',
            'ViaPlaceholder': 'Điểm dừng {viaNumber}',
            'EndPlaceholder': 'Điểm đến',
            'TravelModePlaceholder': 'Phương tiện',
            'RoutePlaceholder': 'Tìm đường...',
            'RouteNumber': 'Lộ trình {number}'
        },
        units: {
            meters: 'm',
            kilometers: 'km',
            yards: 'yards',
            miles: 'miles',
            hours: 'giờ',
            minutes: 'phút',
            seconds: 'giây'
        }
    };
}

const RoutingMachine = ({ userCoords, restaurantCoords }) => {
    const map = useMap();
    useEffect(() => {
        if (!restaurantCoords) return;
        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(userCoords.lat, userCoords.lng),
                L.latLng(restaurantCoords.lat, restaurantCoords.lng)
            ],
            routeWhileDragging: true,
            language: 'vi', // Sử dụng tiếng Việt
            showAlternatives: true,
            formatter: new L.Routing.Formatter({
                language: 'vi', // Ngôn ngữ cho bộ định dạng
                units: 'metric' // Sử dụng đơn vị mét thay vì miles
            }),
            lineOptions: {
                styles: [{ color: '#6FA1EC', weight: 4 }],
                addWaypoints: false,
                extendToWaypoints: true,
                missingRouteTolerance: 0
            },
            createMarker: function () { return null; } // Ẩn marker mặc định của routing
        }).addTo(map);

        // Tùy chỉnh một số phần tử giao diện sau khi component được render
        setTimeout(() => {
            const container = routingControl._container;
            if (container) {
                // Thay đổi các nhãn sang tiếng Việt
                const elements = container.querySelectorAll('.leaflet-routing-alt h2');
                elements.forEach(el => {
                    if (el.textContent === 'Route') {
                        el.textContent = 'Lộ trình';
                    }
                });
            }
        }, 500);

        return () => map.removeControl(routingControl);
    }, [restaurantCoords, map, userCoords]);
    return null;
};

const MapFocus = ({ restaurant }) => {
    const map = useMap();

    useEffect(() => {
        if (restaurant) {
            map.setView([restaurant.lat, restaurant.lng], 16);
        }
    }, [restaurant, map]);

    return null;
};

const NearbyRestaurants = () => {
    const [coords, setCoords] = useState({ lat: 21.0173, lng: 105.7988 });
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [showRoute, setShowRoute] = useState(false);
    const mapRef = useRef(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
                },
                () => {
                    setCoords({ lat: 21.0285, lng: 105.8542 });
                }
            );
        }
    }, []);

    const { data: restaurants, isLoading, isError } = useGetNearbyRestaurantsQuery(coords, { skip: !coords.lat || !coords.lng });

    const handleRestaurantClick = (restaurant) => {
        setSelectedRestaurant({
            lat: restaurant.location.coordinates[1],
            lng: restaurant.location.coordinates[0],
            name: restaurant.name
        });
    };

    const handleShowRoute = () => {
        if (selectedRestaurant) {
            setShowRoute(true);
        }
    };

    const handleHideRoute = () => {
        setShowRoute(false);
    };

    if (isLoading) return <CircularProgress />;
    if (isError) return <Typography color="error">Lỗi tải danh sách nhà hàng</Typography>;

    return (
        <Container maxWidth="lg">
            <Typography variant="h5" className="!font-bold !mt-4">
                Nhà hàng gần đây
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2, height: '600px' }}>
                <Paper sx={{ overflowY: 'auto', p: 2 }}>
                    {selectedRestaurant && (
                        <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography variant="h6">{selectedRestaurant.name}</Typography>
                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={handleShowRoute}
                                    disabled={showRoute}
                                >
                                    Hiển thị đường đi
                                </Button>
                                {showRoute && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        size="small"
                                        onClick={handleHideRoute}
                                    >
                                        Ẩn đường đi
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    )}

                    {/* <Typography variant="h6" sx={{ mb: 1 }}>Danh sách nhà hàng</Typography> */}
                    {restaurants?.data?.map((restaurant) => (
                        <div key={restaurant?._id} className="w-full flex flex-col">
                            <div
                                key={restaurant?._id}
                                className="text-lg font-bold text-center cursor-pointer text-blue-600 hover:underline"
                                onClick={() => handleRestaurantClick(restaurant)}
                                style={{
                                    borderBottom: '1px solid #eee',
                                    backgroundColor: selectedRestaurant?.name === restaurant.name ? '#f0f7ff' : 'transparent',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                {restaurant?.name}
                            </div>
                            <div className='mb-4'>
                                <ProductCard
                                    _id={restaurant?._id}
                                    address={restaurant?.address}
                                    image_url={restaurant?.image_url}
                                    price_per_table={restaurant?.price_per_table}
                                />
                            </div>
                        </div>
                    ))}
                </Paper>
                <Box sx={{ height: '100%', width: '100%', zIndex: 10, position: "relative" }}>
                    <MapContainer
                        center={[coords.lat, coords.lng]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        whenCreated={(map) => (mapRef.current = map)}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />

                        {/* Component để tự động focus vào nhà hàng được chọn */}
                        <MapFocus restaurant={selectedRestaurant} />

                        {showRoute && selectedRestaurant &&
                            <RoutingMachine
                                userCoords={coords}
                                restaurantCoords={selectedRestaurant}
                            />
                        }

                        <Marker
                            position={[coords.lat, coords.lng]}
                            icon={userLocationIcon}
                        >
                            <Popup>Vị trí của bạn</Popup>
                        </Marker>

                        {restaurants?.data?.map((restaurant) => (
                            <Marker
                                key={restaurant._id}
                                position={[restaurant.location.coordinates[1], restaurant.location.coordinates[0]]}
                                icon={restaurantIcon}
                                eventHandlers={{
                                    click: () => {
                                        handleRestaurantClick(restaurant);
                                    }
                                }}
                            >
                                <Popup>{restaurant.name}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </Box>
            </Box>
        </Container>
    );
};

export default NearbyRestaurants;