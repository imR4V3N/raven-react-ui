import {ErrorUI} from "@/components/ui/error/error-ui.tsx";

export function ErrorDemo() {
    return <ErrorUI error={404} message="Page Non Trouver" description="La page que vous cherchez est introuvable" link="/" linkText="Accueil" />;
}