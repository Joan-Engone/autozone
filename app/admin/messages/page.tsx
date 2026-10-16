
import { Mail } from "lucide-react";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Messages de contact
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Consultez les messages envoyés depuis le site.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <p className="text-sm text-gray-500">
              Messages affichés
            </p>
            <p className="mt-1 text-xl font-semibold">
              {messages.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <p className="text-sm text-gray-500">
              Non lus
            </p>
            <p className="mt-1 text-xl font-semibold">
              {messages.filter((message) => !message.isRead).length}
            </p>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <Mail
              className="mx-auto h-10 w-10 text-gray-400"
              aria-hidden="true"
            />
            <h2 className="mt-4 text-lg font-semibold">
              Aucun message pour le moment
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Les messages de contact apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <article
                key={message.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="break-words text-lg font-semibold">
                        {message.name}
                      </h2>

                      {!message.isRead && (
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          Non lu
                        </span>
                      )}
                    </div>

                    <a
                      href={`mailto:${message.email}`}
                      className="mt-2 inline-flex max-w-full items-center gap-2 break-all text-sm text-gray-600 hover:text-red-600"
                    >
                      <Mail
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                      {message.email}
                    </a>

                    {message.subject && (
                      <p className="mt-4 font-medium">
                        {message.subject}
                      </p>
                    )}
                  </div>

                  <time
                    dateTime={message.createdAt.toISOString()}
                    className="shrink-0 text-sm text-gray-500"
                  >
                    {new Date(message.createdAt).toLocaleString(
                      "fr-FR",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      },
                    )}
                  </time>
                </div>

                <div className="mt-5 whitespace-pre-wrap break-words rounded-xl bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                  {message.message}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
