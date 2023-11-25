'use server';
import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";
import { db } from "@/db";

export async function editSnippet(id: number, code: string) {
    await db.snippet.update({
        where: { id },
        data: { code }
    });

    revalidatePath(`/snippets/${id}`);
    redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
    await db.snippet.delete({
        where: { id }
    });

    revalidatePath('/');
    redirect(`/`);
}

export async function createSnippet(formState: {message: string}, formData: FormData) {
    
    
    try{
        const title = formData.get('title') as string;
        const code = formData.get('code') as string;

        if (typeof title !== 'string' || title.length <  3){
            return{
                message: 'Title must be at least 3 characters long'
            };
        }

        if (typeof code !== 'string' || code.length <  10){
            return{
                message: 'COde must be at least 10 characters long'
            };
        }

        const snippet = await db.snippet.create({
            data: {
                title,
                code
            }
        });

    }
        catch(err: unknown){
            if(err instanceof Error){
                return{
                    message: err.message
                };
            }else{
                return {message: 'something went wrong.'}
            }
        }

    revalidatePath('/');
    redirect('/');
}