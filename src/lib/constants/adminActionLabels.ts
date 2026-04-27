export type AdminActionMeta = {
  label: string;
  shortDescription: string;
};

const ADMIN_ACTION_LABELS: Record<string, AdminActionMeta> = {
  approve_beta_application: {
    label: "Одобрил заявку",
    shortDescription: "Одобрение заявки и отправка приглашения",
  },
  reject_beta_application: {
    label: "Отклонил заявку",
    shortDescription: "Отклонение заявки",
  },
  resend_invite_beta_application: {
    label: "Отправил приглашение повторно",
    shortDescription: "Повторная отправка invite-ссылки",
  },
  user_set_role: {
    label: "Изменил роль",
    shortDescription: "Изменение роли пользователя",
  },
  user_set_user_type: {
    label: "Изменил тип доступа",
    shortDescription: "Изменение уровня staff-доступа",
  },
  user_block: {
    label: "Заблокировал пользователя",
    shortDescription: "Блокировка пользователя",
  },
  user_unblock: {
    label: "Разблокировал пользователя",
    shortDescription: "Снятие блокировки с пользователя",
  },
  report_resolve: {
    label: "Подтвердил жалобу",
    shortDescription: "Жалоба отмечена как resolved",
  },
  report_reject: {
    label: "Отклонил жалобу",
    shortDescription: "Жалоба отмечена как rejected",
  },
  report_hide_status: {
    label: "Скрыл статус",
    shortDescription: "Скрытие текста пользовательского статуса",
  },
  report_restrict_user: {
    label: "Ограничил пользователя",
    shortDescription: "Ограничение пользователя по жалобе",
  },
  achievement_create: {
    label: "Создал достижение",
    shortDescription: "Создание нового достижения",
  },
  achievement_update: {
    label: "Изменил достижение",
    shortDescription: "Изменение параметров достижения",
  },
  vfx_create: {
    label: "Создал VFX",
    shortDescription: "Создание нового VFX",
  },
  vfx_update: {
    label: "Изменил VFX",
    shortDescription: "Изменение параметров VFX",
  },
  notification_send: {
    label: "Отправил уведомление",
    shortDescription: "Отправка системного уведомления",
  },
};

const FALLBACK_META: AdminActionMeta = {
  label: "Выполнил действие",
  shortDescription: "Служебное действие staff",
};

export function getAdminActionMeta(action: string): AdminActionMeta {
  return ADMIN_ACTION_LABELS[action] ?? FALLBACK_META;
}

export function getAdminActionLabel(action: string): string {
  return getAdminActionMeta(action).label;
}

export function getAdminActionOptions() {
  return Object.entries(ADMIN_ACTION_LABELS).map(([value, meta]) => ({
    value,
    label: meta.label,
  }));
}
