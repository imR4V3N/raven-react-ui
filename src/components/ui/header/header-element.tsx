import type {HeaderElementType} from "@/components/types/header/header-element-type.ts";
import {ButtonUI} from "@/components/ui/button/button-ui.tsx";
import {Download} from "lucide-react";

export function HeaderElement({header, handleClick} : {
                                                                    header : HeaderElementType,
                                                                    handleClick?: () => void}) {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
                <div className="text-white w-8 h-8 bg-black rounded-md flex items-center justify-center">
                    <header.icon className="w-4 h-4"/>
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                        {header.title}
                    </h2>
                    {header.subtitle && (
                        <p className="text-xs text-gray-500">
                            {header.subtitle}
                        </p>
                    )}
                </div>
            </div>
            {header.isExportable && (
                <ButtonUI type="button" state="normal" icon={Download} text="Exporter" textSize="text-xs" onClick={handleClick} />
            )}
        </div>
    )
}