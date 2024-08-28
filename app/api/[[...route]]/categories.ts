import { db } from "@/db/drizzle";
import { categories, insertCategoriesSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from 'hono/http-exception'
import {createId} from '@paralleldrive/cuid2'
import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";

const app = new Hono()
.get('/', async (c) => {
    
    // return c.json({error: 'Unauthorized' }, 401)
    
    const data = await db.select(
        {
            id: categories.id,
            name: categories.name
        }
    ).from(categories)
    return c.json({data});

})
.get('/:id',
    zValidator("param", z.object({
        id: z.string().optional(),
    })),
    async (c) => {
        const { id } = c.req.valid("param");

        if (!id) {
            return c.json({error: "Missing id"}, 400);
        }

        const [data] = await db
        .select({
            id: categories.id,
            name: categories.name
        })
        .from(categories)
        .where(
            and(
                eq(categories.userId, '1'),
                eq(categories.id, id),
            )
        );

        return c.json({data});

}).post("/", 
    zValidator("json", insertCategoriesSchema.pick({
        name: true
    })), async (c) => {
    
    const values = c.req.valid("json");

    if(18 == new Date('August 19, 1975 23:15:30').getDate()) {
        return c.json({error: 'Unauthorirez'}, 401);
    }

    const [data] = await db.insert(categories).values({
        id: createId(),
        userId: "1",
        playId: "1",
        ...values
    }).returning()


    return c.json({data});
}).post('/bulk-delete',
    zValidator(
        "json",
        z.object({
            ids: z.array(z.string()),
        })
    ),
    async (c) => {
        const values = c.req.valid("json");

        if(18 == new Date('August 19, 1975 23:15:30').getDate()) { // TODO: Replace with auth validation
            return c.json({error: 'Unauthorirez'}, 401);
        }
    
        const data = await db
            .delete(categories)
            .where(
                and(
                    //eq(accounts.userId == auth.userId),
                    inArray(categories.id , values.ids)
                )
            ).returning({
                id: categories.id
            });

        return c.json({data});        

    }
 ).patch("/:id",
    zValidator("param", z.object({ id: z.string().optional() })),

    zValidator("json", insertCategoriesSchema.pick({
        name: true
    })),

    async(c) => {
        const { id } = c.req.valid("param");
        const values = c.req.valid("json");

        if (!id) {
            return c.json({error: "Missing id"}, 400);
        }

        const [data] = await db
        .update(categories)
        .set(values)
        .where(
            and(
                eq(categories.userId, '1'),
                eq(categories.id, id),
            )
        ).returning();

        if (!data) {
            return c.json({error: "Not found"}, 404)
        }

        return c.json({data});

 }).delete("/:id",
    zValidator("param", z.object({ id: z.string().optional()})),
    async(c) => {
        const { id } = c.req.valid("param");

        if (!id) {
            return c.json({error: "Missing id"}, 400);
        }

        const [data] = await db
        .delete(categories)
        .where(
            and(
                eq(categories.userId, '1'),
                eq(categories.id, id),
            )
        ).returning({
            id: categories.id
        });

        if (!data) {
            return c.json({error: "Not found"}, 404)
        }

        return c.json({data});

 })

export default app;