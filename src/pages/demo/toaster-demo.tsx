import {
    CheckCircle2,
    XCircle,
    Info,
    AlertTriangle,
    Bell,
    Trash2,
    RotateCcw,
    Download,
    Save,
    Send,
    Wifi
} from 'lucide-react';
import { ButtonUI } from '@/components/ui/button/button-ui';
import { useToaster } from '@/components/ui/toaster/toaster';
import {HeaderElement} from "@/components/ui/header/header-element.tsx";

export function ToasterDemo() {
    const header = {
        icon: Bell,
        title: "Toaster",
        subtitle: "Démonstration des différents types de toast."
    };

    const toast = useToaster();

    // ========== SECTION 1 : Types de base ==========
    const handleDefault = () => {
        toast.default(
            'Notification',
            'Voici une notification par défaut.'
        );
    };

    const handleSuccess = () => {
        toast.success('Saved successfully');
    };

    const handleSuccessWithMessage = () => {
        toast.success(
            'Enregistrement réussi',
            'Vos modifications ont été sauvegardées avec succès.'
        );
    };

    const handleError = () => {
        toast.error(
            'Something went wrong',
            "We couldn't complete your request. Check your connection and try again.",
            {
                action: [
                    { label: 'Retry', onClick: () => console.log('Retry') },
                    { label: 'Dismiss', onClick: () => console.log('Dismiss') }
                ],
                delay: 8000
            }
        );
    };

    const handleErrorSimple = () => {
        toast.error(
            'Erreur de connexion',
            'Impossible de contacter le serveur.'
        );
    };

    const handleInfo = () => {
        toast.info(
            'Request in progress',
            "We're processing your request. You'll be notified once it's done."
        );
    };

    const handleWarning = () => {
        toast.warning(
            'Attention',
            'Cette action est irréversible. Voulez-vous continuer ?'
        );
    };

    // ========== SECTION 2 : Positions ==========
    const handlePosition = (position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right') => {
        toast.info(
            `Position : ${position}`,
            'Ce toast apparaît dans le coin sélectionné.',
            { position }
        );
    };

    // ========== SECTION 3 : Délais ==========
    const handleDelayFast = () => {
        toast.success('Rapide', 'Disparaît en 2 secondes.', { delay: 2000 });
    };

    const handleDelayNormal = () => {
        toast.info('Normal', 'Disparaît en 5 secondes.', { delay: 5000 });
    };

    const handleDelayLong = () => {
        toast.warning('Long', 'Disparaît en 10 secondes.', { delay: 10000 });
    };

    const handleDelayPersistent = () => {
        toast.default(
            'Persistant',
            'Ce toast ne disparaît pas automatiquement.',
            { delay: 0 }
        );
    };

    // ========== SECTION 4 : Actions ==========
    const handleRetryAction = () => {
        toast.error(
            'Échec de la requête',
            'Impossible de joindre le serveur.',
            {
                delay: 0,
                action: [
                    {
                        label: 'Retry',
                        onClick: () => {
                            toast.success('Nouvelle tentative', 'Reconnexion en cours...');
                        }
                    },
                    {
                        label: 'Dismiss',
                        onClick: () => console.log('Dismissed')
                    }
                ]
            }
        );
    };

    const handleSaveAction = () => {
        toast.info(
            'Modifications non sauvegardées',
            'Souhaitez-vous enregistrer vos changements ?',
            {
                delay: 0,
                action: [
                    {
                        label: 'Enregistrer',
                        onClick: () => toast.success('Sauvegardé !')
                    },
                    {
                        label: 'Ignorer',
                        onClick: () => console.log('Ignoré')
                    }
                ]
            }
        );
    };

    const handleUpdateAction = () => {
        toast.default(
            'Mise à jour disponible',
            'Une nouvelle version (v2.5.0) est prête à être installée.',
            {
                delay: 0,
                action: [
                    {
                        label: 'Mettre à jour',
                        onClick: () => {
                            toast.info('Téléchargement...', 'La mise à jour est en cours.');
                        }
                    },
                    {
                        label: 'Plus tard',
                        onClick: () => console.log('Reporté')
                    }
                ]
            }
        );
    };

    const handleDeleteAction = () => {
        toast.warning(
            'Supprimer cet élément ?',
            'Cette action est définitive et ne peut pas être annulée.',
            {
                delay: 0,
                action: [
                    {
                        label: 'Supprimer',
                        onClick: () => toast.error('Élément supprimé', 'L\'élément a été supprimé définitivement.')
                    },
                    {
                        label: 'Annuler',
                        onClick: () => toast.success('Annulé', 'Aucune modification effectuée.')
                    }
                ]
            }
        );
    };

    // ========== SECTION 5 : Scénarios réels ==========
    const handleFormSubmit = async () => {
        const toastId = toast.info(
            'Envoi en cours...',
            'Votre formulaire est en cours d\'envoi.',
            { delay: 0 }
        );

        // Simulation d'appel API
        setTimeout(() => {
            toast.dismiss(toastId);
            toast.success(
                'Formulaire envoyé !',
                'Nous vous répondrons sous 24h.'
            );
        }, 2000);
    };

    const handleFileDownload = () => {
        toast.success(
            'Téléchargement démarré',
            'export_2026-09-11.csv',
            { delay: 3000 }
        );
    };

    const handleNetworkError = () => {
        toast.error(
            'Pas de connexion',
            'Vérifiez votre connexion internet et réessayez.',
            {
                delay: 0,
                action: [
                    {
                        label: 'Réessayer',
                        onClick: () => {
                            toast.info('Connexion...', 'Test de la connexion en cours.');
                        }
                    }
                ]
            }
        );
    };

    const handleDismissAll = () => {
        toast.dismissAll();
    };

    const handleShowMultiple = () => {
        toast.success('Premier toast', 'Notification 1');
        setTimeout(() => toast.info('Deuxième toast', 'Notification 2'), 300);
        setTimeout(() => toast.warning('Troisième toast', 'Notification 3'), 600);
    };

    return (
        <div className="w-full h-auto bg-white p-5 flex flex-col gap-3 rounded-lg">
            {/* Header */}
            <HeaderElement header={header} />

            <div className="grid grid-cols-1 md:grid md:grid-cols-2 gap-4 place-items-center">
                {/* Section 1 : Types de base */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-base font-semibold text-gray-900 mb-1">
                        Types de base
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">
                        Les 5 types de toasts disponibles.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <ButtonUI
                            type="button"
                            state="normal"
                            icon={Bell}
                            text="Default"
                            textColor="text-gray-700"
                            bgColor="bg-white"
                            textSize="text-xs"
                            onClick={handleDefault}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            icon={CheckCircle2}
                            text="Success"
                            textColor="text-white"
                            bgColor="bg-emerald-500"
                            textSize="text-xs"
                            onClick={handleSuccess}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            icon={Info}
                            text="Info"
                            textColor="text-white"
                            bgColor="bg-blue-500"
                            textSize="text-xs"
                            onClick={handleInfo}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            icon={AlertTriangle}
                            text="Warning"
                            textColor="text-white"
                            bgColor="bg-amber-500"
                            textSize="text-xs"
                            onClick={handleWarning}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            icon={XCircle}
                            text="Error"
                            textColor="text-white"
                            bgColor="bg-red-500"
                            textSize="text-xs"
                            onClick={handleErrorSimple}
                        />
                    </div>

                    <h3 className="text-sm font-medium text-gray-700 mt-6 mb-3">
                        Variantes (avec titre + message)
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        <ButtonUI
                            type="button"
                            state="normal"
                            text="Success complet"
                            textColor="text-emerald-700"
                            bgColor="bg-emerald-50"
                            textSize="text-xs"
                            onClick={handleSuccessWithMessage}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            text="Info complet"
                            textColor="text-blue-700"
                            bgColor="bg-blue-50"
                            textSize="text-xs"
                            onClick={handleInfo}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            text="Error avec actions"
                            textColor="text-red-700"
                            bgColor="bg-red-50"
                            textSize="text-xs"
                            onClick={handleError}
                        />
                    </div>
                </div>

                {/* Section 2 : Positions */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-base font-semibold text-gray-900 mb-1">
                        Positions
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">
                        Les 6 positions d'affichage disponibles.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <ButtonUI
                            type="button"
                            state="normal"
                            text="Top Left"
                            textColor="text-gray-700"
                            bgColor="bg-gray-50"
                            textSize="text-xs"
                            onClick={() => handlePosition('top-left')}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            text="Top Center"
                            textColor="text-gray-700"
                            bgColor="bg-gray-50"
                            textSize="text-xs"
                            onClick={() => handlePosition('top-center')}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            text="Top Right"
                            textColor="text-gray-700"
                            bgColor="bg-gray-50"
                            textSize="text-xs"
                            onClick={() => handlePosition('top-right')}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            text="Bottom Left"
                            textColor="text-gray-700"
                            bgColor="bg-gray-50"
                            textSize="text-xs"
                            onClick={() => handlePosition('bottom-left')}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            text="Bottom Center"
                            textColor="text-gray-700"
                            bgColor="bg-gray-50"
                            textSize="text-xs"
                            onClick={() => handlePosition('bottom-center')}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            text="Bottom Right"
                            textColor="text-gray-700"
                            bgColor="bg-gray-50"
                            textSize="text-xs"
                            onClick={() => handlePosition('bottom-right')}
                        />
                    </div>
                </div>

                {/* Section 3 : Délais */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-base font-semibold text-gray-900 mb-1">
                        Délais d'affichage
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">
                        Contrôlez la durée d'affichage des toasts.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <ButtonUI
                            type="button"
                            state="normal"
                            text="2 secondes"
                            textColor="text-white"
                            bgColor="bg-emerald-500"
                            textSize="text-xs"
                            onClick={handleDelayFast}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            text="5 secondes"
                            textColor="text-white"
                            bgColor="bg-blue-500"
                            textSize="text-xs"
                            onClick={handleDelayNormal}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            text="10 secondes"
                            textColor="text-white"
                            bgColor="bg-amber-500"
                            textSize="text-xs"
                            onClick={handleDelayLong}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            text="Persistant (delay: 0)"
                            textColor="text-white"
                            bgColor="bg-gray-800"
                            textSize="text-xs"
                            onClick={handleDelayPersistent}
                        />
                    </div>
                </div>

                {/* Section 4 : Actions */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-base font-semibold text-gray-900 mb-1">
                        Actions personnalisées
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">
                        Ajoutez des boutons d'action aux toasts.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <ButtonUI
                            type="button"
                            state="normal"
                            icon={RotateCcw}
                            text="Retry / Dismiss"
                            textColor="text-white"
                            bgColor="bg-red-500"
                            textSize="text-xs"
                            onClick={handleRetryAction}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            icon={Save}
                            text="Save / Ignore"
                            textColor="text-white"
                            bgColor="bg-blue-500"
                            textSize="text-xs"
                            onClick={handleSaveAction}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            icon={Download}
                            text="Update / Later"
                            textColor="text-white"
                            bgColor="bg-gray-800"
                            textSize="text-xs"
                            onClick={handleUpdateAction}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            icon={Trash2}
                            text="Delete / Cancel"
                            textColor="text-white"
                            bgColor="bg-amber-500"
                            textSize="text-xs"
                            onClick={handleDeleteAction}
                        />
                    </div>
                </div>

                {/* Section 5 : Scénarios réels */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-base font-semibold text-gray-900 mb-1">
                        Scénarios réels
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">
                        Cas d'usage concrets dans une application.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <ButtonUI
                            type="button"
                            state="normal"
                            icon={Send}
                            text="Soumettre un formulaire"
                            textColor="text-white"
                            bgColor="bg-black"
                            textSize="text-xs"
                            onClick={handleFormSubmit}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            icon={Download}
                            text="Télécharger un fichier"
                            textColor="text-white"
                            bgColor="bg-emerald-500"
                            textSize="text-xs"
                            onClick={handleFileDownload}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            icon={Wifi}
                            text="Erreur réseau"
                            textColor="text-white"
                            bgColor="bg-red-500"
                            textSize="text-xs"
                            onClick={handleNetworkError}
                        />
                    </div>
                </div>

                {/* Section 6 : Utilitaires */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-base font-semibold text-gray-900 mb-1">
                        Utilitaires
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">
                        Gestion des toasts en masse.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <ButtonUI
                            type="button"
                            state="normal"
                            icon={Bell}
                            text="Afficher 3 toasts"
                            textColor="text-white"
                            bgColor="bg-blue-500"
                            textSize="text-xs"
                            onClick={handleShowMultiple}
                        />
                        <ButtonUI
                            type="button"
                            state="normal"
                            icon={Trash2}
                            text="Tout fermer"
                            textColor="text-red-700"
                            bgColor="bg-red-50"
                            textSize="text-xs"
                            onClick={handleDismissAll}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}