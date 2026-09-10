import { useState } from "react";
import { InputOtp } from "@/components/ui/input/input-otp.tsx";
import { ButtonUI } from "@/components/ui/button/button-ui.tsx";
import { Check, X } from "lucide-react";
import {toast} from "sonner";

export function OtpDemo() {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [error, setError] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOtpChange = (e: any) => {
        const newValue = e.target.value as string[];
        setOtp(newValue);
    };

    const handleValidate = () => {
        setIsSubmitting(true);
        setError(Array(6).fill(''));
        const code = otp.join('');

        console.log('=== VALIDATION OTP ===');
        console.log('Code saisi:', code);
        console.log('Valeur array:', otp);

        if (otp.every(v => v !== '')) {
            setTimeout(() => {
                toast.success('Code validé avec succès !')
                setIsSubmitting(false);
                handleCancel();
            }, 1000);
        } else {
            setError(Array(6).fill('Veuillez remplir tous les champs'));
            toast.error('Code incomplet');
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        const emptyOtp = Array(6).fill('');
        setOtp(emptyOtp);
        setError(Array(6).fill(''));
    };

    return (
        <div className="w-full flex flex-col items-center bg-white rounded-lg p-3 gap-3">
            <h2 className="text-lg font-semibold text-gray-800">Validation du code de vérification</h2>

            <InputOtp
                label="Code de vérification"
                name="otp"
                length={6}
                isRequired
                type="number"
                value={otp}
                onChange={handleOtpChange}
                error={error.some(e => e !== '') ? error[0] : ''}
            />

            <div className="flex gap-3 pt-4 border-t border-gray-200">
                <ButtonUI
                    type="button"
                    state="normal"
                    icon={X}
                    text="Annuler"
                    textColor="text-black"
                    width="w-auto"
                    bgColor="bg-white"
                    textSize="text-xs"
                    hoverBg="bg-red-300"
                    hoverText="text-red-500"
                    onClick={handleCancel}
                />
                <ButtonUI
                    type="button"
                    state={isSubmitting ? "loading" : otp.every(v => v !== '') ? "normal" : "disabled"}
                    loadingType="pulse"
                    loadingText="Validation en cours..."
                    icon={Check}
                    text="Valider"
                    textColor="text-white"
                    width="w-auto"
                    bgColor="bg-black"
                    textSize="text-xs"
                    hoverBg="bg-amber-400"
                    hoverText="text-black"
                    onClick={handleValidate}
                />
            </div>
        </div>
    );
}