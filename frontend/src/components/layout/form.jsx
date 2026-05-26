{ /*aqui vai ficar a unidade de elemento forms*/ }
{/*form object vai ser importado pela função de criar forms lá dentro da página de visualizar formulários */ }
import {useForm} from  'react-hook-form'
{       /* vou importar o hook useForm */
}{/*esse hook form vai retomar o objeto methods*/ 
    }
    
    const form = ()=>{
    
        const {register,handleSubmit} = useForm();
        {/*quando a gente precisar dizer que o form já foi preenchido a gente vai 
            usar a função handlesumit.
            A handleSubmit vai receber como parametro a função que a gente quer executar se 
            o nosso formulário estiver válido */}
        const onSubmit = () => {};
        {/*vamos usar a função register para validar os inputs*/ }
         return (
            <div>
                <div>
                     <label>Nome </label>
                     <input
                     type="text"
                     placeholder="seu nome"
                     {...register("name")}
                    />
                     {/*quando a gente chama register a gente tem que passar um parametro , "name",
                         que é o nome do input*/}
                </div>
                <div>
                    <label>Email</label>
                    <input
                    type="text"
                    placeholder='seu email'
                    {...register("email")}
                    />

                </div>
                <div>
                    <button>onClick={()=>handleSubmit(onSubmit)()} enviar resposta do formulário</button>
                    {/*esse onsubmit vai receber um objeto chamado data  */}
                </div>
            </div>
    );
    };
