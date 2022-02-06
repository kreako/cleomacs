import RoundAdsClick from "~icons/ic/round-ads-click"

export default function LostPasswordSent() {
  return (
    <div className="mt-6 mb-4 flex flex-col items-center space-y-4 text-center text-sky-900">
      <div className="flex flex-col items-center">
        <div className="font-bold tracking-wide">Et voilà !</div>
        <div className="mt-6 ">
          J&apos;ai bien reconnu votre adresse email et je viens de vous y envoyer un message.
        </div>
        <div className="mt-1">
          <span>Dedans vous trouverez un lien sur lequel vous devez&nbsp;</span>
          <span className="underline decoration-sky-500 decoration-dotted">cliquer</span>
          <span>&nbsp;</span>
          <RoundAdsClick
            width={"1em"}
            height={"1em"}
            className="inline-block animate-pulse text-sky-500"
          />
          <span>&nbsp; pour changer votre mot de passe !</span>
        </div>
        <div className="mt-4 text-sm">
          Le lien sera valide pour les 4 prochaines heures et si vous ne trouvez pas le mail,
          n&apos;hésitez pas à fouiller aussi dans votre dossier des spams.
        </div>
      </div>
    </div>
  )
}
