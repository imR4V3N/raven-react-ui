import {DataTable} from "@/components/ui/table/data-table.tsx";
import type {ColumnType} from "@/components/types/table/column-type.ts";
import {List} from "lucide-react";

export function TableDemo() {
    const columns: ColumnType[] = [
        {
            key: 'name',
            title: 'Name',
            sortable: true,
        },
        {
            key: 'email',
            title: 'Email',
            sortable: true,
        },
        {
            key: 'location',
            title: 'Location',
        },
        {
            key: 'balance',
            title: 'Balance ($)',
            sortable: true,
            cell: ({ row }) => (
                <span className="font-medium text-gray-900">
                    ${row.original.balance}
                </span>
            )
        }
    ];
    const data = [
        {
            name: 'Sophia Johnson',
            email: 'sophia@meta.com',
            location: 'Toronto, Canada',
            balance: '7654.98'
        },
        {
            name: 'Robert Smith',
            email: 'robert@openai.com',
            location: 'London, UK',
            balance: '4321.87'
        },
        {
            name: 'Olivia Brown',
            email: 'olivia@lvmh.fr',
            location: 'Paris, France',
            balance: '7345.10'
        },
        {
            name: 'Michael Clark',
            email: 'michael@eni.it',
            location: 'Milan, Italy',
            balance: '5214.88'
        },
        {
            name: 'Lucas Walker',
            email: 'lucas@tesla.com',
            location: 'Sydney, Australia',
            balance: '3456.45'
        },
        {
            name: 'Emma Davis',
            email: 'emma@google.com',
            location: 'New York, USA',
            balance: '9876.54'
        },
        {
            name: 'James Wilson',
            email: 'james@amazon.com',
            location: 'Seattle, USA',
            balance: '6543.21'
        },
        {
            name: 'Mia Thompson',
            email: 'mia@spotify.com',
            location: 'Stockholm, Sweden',
            balance: '8765.43'
        },
        {
            name: 'William Garcia',
            email: 'william@apple.com',
            location: 'Cupertino, USA',
            balance: '5432.10'
        },
        {
            name: 'Charlotte Martinez',
            email: 'charlotte@netflix.com',
            location: 'Los Gatos, USA',
            balance: '7654.32'
        },
        {
            name: 'Alexander Robinson',
            email: 'alex@microsoft.com',
            location: 'Redmond, USA',
            balance: '9876.54'
        },
        {
            name: 'Amelia Lee',
            email: 'amelia@tencent.com',
            location: 'Shenzhen, China',
            balance: '6543.21'
        }
    ];
    const header = {
        icon: List,
        title: "Liste d'éléments",
        subtitle: "Gérez vos éléments ici",
        isExportable: true
    };

    return (
        <div className="w-full h-full bg-gray-200 p-3">
            <DataTable
                columns={columns}
                data={data}
                rowsPerPageOptions={[5, 10, 25, 50]}
                defaultRowsPerPage={5}
                header={header}
            />
        </div>
    )
}