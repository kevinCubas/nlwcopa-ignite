import Image from "next/image";
import appPhonesPreview from "../assets/app-phones-preview.png";
import nlwLogo from "../assets/nlw-logo.svg";
import usersAvatarExample from "../assets/users-avatars-example.png";
import checkIcon from "../assets/check-icon.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
};

export default function Home(props:HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post("pools", {
        title: poolTitle
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code)
      
      alert("O bolão foi criado e o código copiado para a área de transferência.")

      setPoolTitle("")
    } catch (err){
      alert("Falha ao criar o bolão, tente novamente!")
    }
  };

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={nlwLogo} alt="NLW Copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExample} alt=""/>
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"  
            type="text" 
            placeholder="Qual nome do seu bolão?" 
            required
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
            />
          <button 
            className="bg-yellow-500 px-6 py-4 rounded font-bold text-gray-900 text-sm uppercase hover:bg-yellow-700"
            type="submit"
            >
              Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
          </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={checkIcon} alt=""/>
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados </span>
            </div>
          </div>
          <div className="w-px h-10 bg-gray-600"></div>
          <div className="flex items-center gap-6">
            <Image src={checkIcon} alt=""/>
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image 
        src={appPhonesPreview} 
        alt="Dois celulares exibindo uma prévia do NLW Copa" 
        quality={100}
      />

    </div>
  )
}

export const getServerSideProps = async () => {

  const [
    poolCountResponse, 
    guessCountResponse, 
    userCountResponse
  ] = await Promise.all([
    api.get("pools/count"),
    api.get("guesses/count"),
    api.get("users/count")
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}