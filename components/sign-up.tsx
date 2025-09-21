/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { on } from "events";

// Usuários iniciais (serão adicionados ao localStorage na primeira execução)
const initialUsers = [
  {
    name: "Admin",
    email: "admin@email.com",
    password: "admin123",
    cpf: "11122233344",
  },
];

export function SignUpForm({}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("enter");

  // Formulário para login
  const loginForm = useForm({
    defaultValues: {
      cpf: "",
      password: "",
    },
  });

  // Formulário para registro
  const registerForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      cpf: "",
    },
  });

  // Inicializa o localStorage com usuários padrão se não existir
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (!storedUsers) {
      localStorage.setItem("users", JSON.stringify(initialUsers));
    }
  }, []);

  // Função para obter usuários do localStorage
  function getUsers() {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : initialUsers;
  }

  // Função para salvar usuários no localStorage
  function saveUsers(users: any[]) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function onLoginSubmit(data: any) {
    const users = getUsers();
    const userFound = users.find(
      (user: any) => user.cpf === data.cpf && user.password === data.password
    );

    if (userFound) {
      toast.success(`Bem-vindo(a), ${userFound.name}!`);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify(userFound));
      loginForm.reset();
      router.push("/");
    } else {
      toast.error("CPF ou senha inválidos. Verifique suas credenciais.");
    }
  }
  function onRegisterSubmit(data: any) {
    const users = getUsers();

    // Verifica se o CPF já está cadastrado
    const cpfExists = users.find((user: any) => user.cpf === data.cpf);
    if (cpfExists) {
      toast.error("Este CPF já está cadastrado!");
      return;
    }

    // Verifica se o email já está cadastrado
    const emailExists = users.find((user: any) => user.email === data.email);
    if (emailExists) {
      toast.error("Este email já está cadastrado!");
      return;
    }

    // Adiciona o novo usuário
    const newUser = {
      name: data.name,
      email: data.email,
      password: data.password,
      cpf: data.cpf,
      createdAt: new Date().toISOString(), // Adiciona timestamp de criação
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    toast.success(
      `Conta criada com sucesso, ${data.name}! Agora você pode fazer login.`
    );

    // Limpa o formulário e muda para a aba de login
    registerForm.reset();
    setActiveTab("enter");
  }

  // Função para limpar todos os usuários (útil para desenvolvimento)
  function clearAllUsers() {
    localStorage.setItem("users", JSON.stringify(initialUsers));
    toast("Banco de dados resetado para usuários padrão.");
  }

  // Função para visualizar usuários cadastrados (útil para debug)
  function viewUsers() {
    const users = getUsers();
    console.log("Usuários cadastrados:", users);
    toast.message(`Total de usuários cadastrados: ${users.length}`, {
      description: `Verifique o console para mais detalhes.`,
    });
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enter">Entrar</TabsTrigger>
          <TabsTrigger value="register">Registrar</TabsTrigger>
        </TabsList>

        <TabsContent value="enter">
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Entrar</CardTitle>
                  <CardDescription>
                    Entre com suas credenciais para acessar sua conta.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <FormField
                    control={loginForm.control}
                    name="cpf"
                    rules={{
                      required: "CPF é obrigatório",
                      minLength: {
                        value: 11,
                        message: "CPF deve ter 11 dígitos",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="000.000.000-00"
                            maxLength={14}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    rules={{
                      required: "Senha é obrigatória",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button className="w-full" type="submit">
                    Entrar
                  </Button>
                  <div className="text-sm text-muted-foreground text-center">
                    Não tem uma conta?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("register")}
                      className="text-primary hover:underline"
                    >
                      Registre-se
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="register">
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Registrar-se</CardTitle>
                  <CardDescription>
                    Crie sua conta para ter acesso completo ao sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    rules={{
                      required: "Nome é obrigatório",
                      minLength: {
                        value: 3,
                        message: "Nome deve ter pelo menos 3 caracteres",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    rules={{
                      required: "Email é obrigatório",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Email inválido",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="seu@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    rules={{
                      required: "Senha é obrigatória",
                      minLength: {
                        value: 6,
                        message: "Senha deve ter pelo menos 6 caracteres",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="cpf"
                    rules={{
                      required: "CPF é obrigatório",
                      minLength: {
                        value: 11,
                        message: "CPF deve ter 11 dígitos",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="000.000.000-00"
                            maxLength={14}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button className="w-full" type="submit">
                    Criar conta
                  </Button>
                  <div className="text-sm text-muted-foreground text-center">
                    Já tem uma conta?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("enter")}
                      className="text-primary hover:underline"
                    >
                      Faça login
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
      </Tabs>

      {/* Botões de debug (remova em produção) */}
      <div className="flex gap-2 text-xs 20">
        <button
          onClick={viewUsers}
          className="text-muted-foreground hover:text-primary"
        >
          Ver usuários
        </button>
        <span className="text-muted-foreground">|</span>

        <AlertDialog>
          <AlertDialogTrigger>
            <button className="text-muted-foreground hover:text-destructive">
              Resetar dados
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Resetar banco de dados?</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja resetar o banco de dados? Todos os
                usuários serão removidos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Não</AlertDialogCancel>
              <AlertDialogAction onClick={clearAllUsers}>Sim</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
