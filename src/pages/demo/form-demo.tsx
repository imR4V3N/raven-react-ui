import { useState, type FormEvent } from 'react';
import {X, Save, List} from 'lucide-react';
import { Input } from '@/components/ui/input/input';
import { Select } from '@/components/ui/input/select';
import { InputDate } from '@/components/ui/input/input-date';
import { InputCheck } from '@/components/ui/input/input-check';
import { InputFile } from '@/components/ui/input/input-file';
import { Textarea } from '@/components/ui/input/textarea';
import { InputColor } from '@/components/ui/input/input-color';
import { ButtonUI } from '@/components/ui/button/button-ui';
import {toast} from "sonner";
import {HeaderElement} from "@/components/ui/header/header-element.tsx";

interface FormErrors {
    fullName?: string;
    poles?: string;
    birthdate?: string;
    gender?: string;
    interests?: string;
    documents?: string;
    comment?: string;
    themeColor?: string;
    terms?: string;
}

export function FormDemo() {
    // États pour chaque champ
    const [fullName, setFullName] = useState('');
    const [poles, setPoles] = useState<string[]>([]);
    const [birthdate, setBirthdate] = useState('');
    const [gender, setGender] = useState('');
    const [interests, setInterests] = useState<string[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);
    const [comment, setComment] = useState('');
    const [themeColor, setThemeColor] = useState('#3B82F6');
    const [terms, setTerms] = useState(false);

    // États pour les erreurs
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Options
    const poleOptions = [
        { label: 'Traduction & Multilinguisme', value: 'traduction' },
        { label: 'Mentorat & Coaching Jeunes', value: 'mentorat' },
        { label: "Organisation d'Événements", value: 'evenementiel' },
        { label: 'Communication & Réseaux Sociaux', value: 'communication' },
        { label: 'Plaidoyer & Juridique', value: 'juridique' }
    ];

    const colorPresets = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
        '#FFEAA7', '#DDA0DD', '#FF9FF3', '#54A0FF',
        '#5F27CD', '#FF9F43', '#00D2D3', '#01A3A4'
    ];

    // Validation du formulaire
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!fullName.trim()) {
            newErrors.fullName = 'Le nom complet est requis';
        } else if (fullName.trim().length < 3) {
            newErrors.fullName = 'Le nom doit contenir au moins 3 caractères';
        }

        if (poles.length === 0) {
            newErrors.poles = 'Sélectionnez au moins un pôle d\'intérêt';
        }

        if (!birthdate) {
            newErrors.birthdate = 'La date de naissance est requise';
        } else {
            const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
            if (age < 18) {
                newErrors.birthdate = 'Vous devez avoir au moins 18 ans';
            }
        }

        if (!gender) {
            newErrors.gender = 'Veuillez sélectionner une civilité';
        }

        if (interests.length === 0) {
            newErrors.interests = 'Sélectionnez au moins un centre d\'intérêt';
        }

        if (documents.length === 0) {
            newErrors.documents = 'Veuillez télécharger au moins un document';
        }

        if (!terms) {
            newErrors.terms = 'Vous devez accepter les conditions générales';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Soumission du formulaire
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitSuccess(false);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        // Préparation des données
        const formData = {
            fullName: fullName.trim(),
            poles,
            birthdate,
            gender,
            interests,
            documents: documents.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            comment: comment.trim(),
            themeColor,
            terms,
            submittedAt: new Date().toISOString()
        };

        // Affichage dans la console
        console.log('=== FORMULAIRE SOUMIS ===');
        console.log('📝 Données du formulaire :');
        console.log('  - Nom complet:', formData.fullName);
        console.log('  - Pôles d\'intérêt:', formData.poles);
        console.log('  - Date de naissance:', formData.birthdate);
        console.log('  - Civilité:', formData.gender);
        console.log('  - Centres d\'intérêt:', formData.interests);
        console.log('  - Documents:', formData.documents);
        console.log('  - Commentaire:', formData.comment || '(vide)');
        console.log('  - Couleur de thème:', formData.themeColor);
        console.log('  - Conditions acceptées:', formData.terms);
        console.log('  - Date de soumission:', formData.submittedAt);
        console.log('📊 Résumé :');
        console.log(`  - ${formData.documents.length} document(s) téléchargé(s)`);
        console.log(`  - ${formData.poles.length} pôle(s) sélectionné(s)`);
        console.log(`  - ${formData.interests.length} centre(s) d'intérêt`);
        console.log('=== FIN ===');

        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setSubmitSuccess(true);

        // Reset succès après 3 secondes
        setTimeout(() => setSubmitSuccess(false), 3000);

        toast.success('Formulaire soumis avec succès !');

        // Optionnel : Reset du formulaire
        // resetForm();
    };

    // Reset du formulaire
    const resetForm = () => {
        setFullName('');
        setPoles([]);
        setBirthdate('');
        setGender('');
        setInterests([]);
        setDocuments([]);
        setComment('');
        setThemeColor('#3B82F6');
        setTerms(false);
        setErrors({});
        setSubmitSuccess(false);
    };

    const header = {
        icon: List,
        title: "Formulaire d'inscription",
        subtitle: "Veuillez remplir tous les champs requis",
        isExpanded: false
    };

    return (
        <form onSubmit={handleSubmit} className="w-full h-auto bg-white p-5 flex flex-col gap-3 rounded-lg">
            <HeaderElement header={header} />

            <div className="space-y-4 grid grid-cols-3">
                {/* Nom complet */}
                <Input
                    type="text"
                    className="bg-white"
                    placeholder="Ex: Lucas Mercier"
                    label="Nom complet"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    isRequired
                    error={errors.fullName}
                />

                {/* Pôles d'intérêt */}
                <Select
                    label="Pôles d'intérêt"
                    name="poles"
                    options={poleOptions}
                    type="multiple"
                    isRequired
                    placeholder="Sélectionnez vos pôles"
                    value={poles}
                    onChange={(e) => setPoles(e.target.value as unknown as string[])}
                    error={errors.poles}
                />

                {/* Date de naissance */}
                <InputDate
                    label="Date de naissance"
                    name="birthdate"
                    type="date"
                    isRequired
                    className="bg-white"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    error={errors.birthdate}
                />

                {/* Civilité */}
                <InputCheck
                    label="Civilité"
                    name="gender"
                    type="radio"
                    options={[
                        { label: 'Monsieur', value: 'mr' },
                        { label: 'Madame', value: 'mrs' },
                        { label: 'Autre', value: 'other' }
                    ]}
                    isRequired
                    direction="vertical"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    error={errors.gender}
                />

                {/* Centres d'intérêt */}
                <InputCheck
                    label="Centres d'intérêt"
                    name="interests"
                    type="checkbox"
                    options={[
                        { label: 'Sport', value: 'sport' },
                        { label: 'Lecture', value: 'reading' },
                        { label: 'Musique', value: 'music' },
                        { label: 'Voyages', value: 'travel' }
                    ]}
                    direction="horizontal"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value as unknown as string[])}
                    error={errors.interests}
                />

                {/* Upload de documents */}
                <InputFile
                    label="Documents"
                    name="documents"
                    type="multiple"
                    format={['PDF', 'JPEG', 'PNG', 'MP4']}
                    isRequired
                    max={50 * 1024 * 1024}
                    value={documents}
                    onChange={(e) => setDocuments(e.target.value as File[])}
                    error={errors.documents}
                />

                {/* Commentaire */}
                <Textarea
                    label="Commentaire"
                    name="comment"
                    placeholder="Votre commentaire..."
                    autoResize
                    maxHeight="300px"
                    resize="none"
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                {/* Couleur de thème */}
                <InputColor
                    label="Couleur de thème"
                    name="themeColor"
                    presets={colorPresets}
                    showHex
                    showRgb
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                />

                {/* Conditions générales */}
                <InputCheck
                    label="J'accepte les conditions générales"
                    name="terms"
                    type="checkbox"
                    isRequired
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    error={errors.terms}
                />

                {/* Boutons d'action */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <ButtonUI
                        type="button"
                        state="normal"
                        icon={X}
                        text="Annuler"
                        textColor="text-black"
                        width="w-30"
                        bgColor="bg-white"
                        textSize="text-xs"
                        hoverBg="bg-red-300"
                        hoverText="text-red-500"
                        onClick={resetForm}
                    />
                    <ButtonUI
                        type="submit"
                        state={isSubmitting ? "loading" : "normal"}
                        loadingText="Envoi en cours..."
                        loadingType="spin"
                        icon={Save}
                        text="Enregistrer"
                        textColor="text-white"
                        width="w-auto"
                        bgColor="bg-black"
                        textSize="text-xs"
                        hoverBg="bg-amber-400"
                        hoverText="text-black"
                    />
                </div>

                 {/*Affichage des erreurs globales */}
                {Object.keys(errors).length > 0 && !isSubmitting && (
                    toast.error("Veuillez corriger les erreurs ci-dessus")
                )}
            </div>
        </form>
    );
}