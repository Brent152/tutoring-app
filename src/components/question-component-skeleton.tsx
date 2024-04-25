'use client';

import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Skeleton } from './ui/skeleton';

export default function QuestionComponentSkeleton() {

    return (
        <Card>
            <CardHeader className='text-2xl border-b'><Skeleton className="h-8 w-1/3" /></CardHeader>
            <CardContent>
                <h3 className='text-lg my-8'><Skeleton className="h-6 w-1/2" /></h3>
                <hr />
                <div className='flex flex-col gap-3'>
                    <br />
                    <Skeleton className="h-6 " />
                    <hr />
                    <Skeleton className="h-6 " />
                    <hr />
                    <Skeleton className="h-6 " />
                    <hr />
                    <Skeleton className="h-6 " />
                </div>
            </CardContent>
        </Card>
    );
}
