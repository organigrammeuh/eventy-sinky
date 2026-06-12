export async function register() {
    const { setGlobalDispatcher, Agent } = await import("undici");
    setGlobalDispatcher(new Agent({ connect: { family: 4 } }));
}