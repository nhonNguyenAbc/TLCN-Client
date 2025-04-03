import React, { useEffect, useState } from 'react';
import { useGetNearbyRestaurantsQuery } from '../apis/restaurantApi';
import {
    CircularProgress,
    Typography,
    Container,
    Box,
    Paper,
    TextField,
    Button
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import ProductCard from '../components/restaurant/ProductCard';

const getAddressFromCoords = async (lat, lng) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        return data.display_name || 'Không tìm thấy địa chỉ';
    } catch (error) {
        console.error('Lỗi khi lấy địa chỉ:', error);
        return 'Lỗi khi lấy địa chỉ';
    }
};

const NearbyRestaurants = () => {
    const [coords, setCoords] = useState({ lat: 21.0173, lng: 105.7988 });
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [showRoute, setShowRoute] = useState(false);
    const [currentAddress, setCurrentAddress] = useState('Đang lấy địa chỉ...');
    const [restaurantAddress, setRestaurantAddress] = useState('');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const newCoords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setCoords(newCoords);
                    const address = await getAddressFromCoords(newCoords.lat, newCoords.lng);
                    setCurrentAddress(address);
                },
                (error) => {
                    console.error("Lỗi khi lấy vị trí:", error);
                    setCurrentAddress('Không thể xác định vị trí');
                }
            );
        }
    }, []);

    const {
        data: restaurants,
        isLoading,
        isError,
        error
    } = useGetNearbyRestaurantsQuery(coords.lat && coords.lng ? coords : undefined, { skip: !coords.lat || !coords.lng });

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Typography color="error" align="center" my={4}>
                Lỗi khi tải danh sách nhà hàng: {error?.data?.message || 'Unknown error'}
            </Typography>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Nhà hàng gần đây
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2, height: '600px' }}>
                {/* Danh sách nhà hàng */}
                <Paper sx={{ overflowY: 'auto', p: 2 }}>
                    <div className="flex flex-col gap-4 mt-12">
                        {restaurants?.data?.map((restaurant) => (
                            <div key={restaurant?._id} className="w-full flex flex-col gap-6">
                                <div
                                    className="text-lg font-bold mb-2 text-center cursor-pointer text-blue-600 hover:underline"
                                    onClick={async () => {
                                        const newRestaurant = {
                                            lat: restaurant.location.coordinates[1],
                                            lng: restaurant.location.coordinates[0],
                                            name: restaurant.name
                                        };
                                        setSelectedRestaurant(newRestaurant);
                                        setShowRoute(false);
                                        const address = await getAddressFromCoords(newRestaurant.lat, newRestaurant.lng);
                                        setRestaurantAddress(address);
                                    }}
                                >
                                    {restaurant?.name}
                                </div>
                                <ProductCard
                                    _id={restaurant?._id}
                                    address={restaurant?.address}
                                    image_url={restaurant?.image_url}
                                    price_per_table={restaurant?.price_per_table}
                                />
                            </div>
                        ))}
                    </div>
                </Paper>

                {/* Bản đồ + Input */}
                <Box sx={{ height: '100%', width: '100%' }}>
                    {/* Hiển thị 2 text field */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                        <TextField
                            label="Vị trí hiện tại"
                            value={currentAddress}
                            InputProps={{ readOnly: true }}
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            label="Vị trí nhà hàng"
                            value={selectedRestaurant ? restaurantAddress : 'Chưa chọn'}
                            InputProps={{ readOnly: true }}
                            variant="outlined"
                            fullWidth
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!selectedRestaurant}
                            onClick={() => setShowRoute(true)}
                        >
                            Đường đi
                        </Button>
                    </Box>

                    {/* Bản đồ */}
                    <MapContainer center={[coords.lat, coords.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {/* Marker vị trí hiện tại */}
                        <Marker position={[coords.lat, coords.lng]}>
                            <Popup>Vị trí của bạn</Popup>
                        </Marker>

                        {/* Marker nhà hàng */}
                        {restaurants?.data?.map((restaurant) => (
                            <Marker
                                key={restaurant._id}
                                position={[
                                    restaurant.location.coordinates[1],
                                    restaurant.location.coordinates[0]
                                ]}
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
