import React from 'react';
import PaymentStatus from '../../../components/PaymentStatus';
import { useRouter } from 'next/router';

const MainScreen = () => {
    const router = useRouter();
    const { status } = router.query;
    return(
        <>
            <PaymentStatus
                pageStatus={status}
            />
        </>
    );
}

export default MainScreen;